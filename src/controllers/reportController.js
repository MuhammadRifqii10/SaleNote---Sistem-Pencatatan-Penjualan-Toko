import reportModel from "../models/reportModel.js";

const summarizeSales = (sales) => {
  const totalAmount = sales.reduce((s, sale) => s + Number(sale.total || 0), 0);
  const totalCount = sales.length;
  const itemsMap = {};
  sales.forEach((sale) => {
    sale.sale_items.forEach((it) => {
      const pid = String(it.product_id);
      if (!itemsMap[pid]) itemsMap[pid] = { product: it.products || null, quantity: 0, subtotal: 0 };
      itemsMap[pid].quantity += Number(it.quantity);
      itemsMap[pid].subtotal += Number(it.subtotal || it.price * it.quantity);
    });
  });
  const items = Object.values(itemsMap);
  return { totalCount, totalAmount, items };
};

const daily = async (req, res, next) => {
  try {
    const { date } = req.query; // expected YYYY-MM-DD
    const target = date || new Date().toISOString().slice(0, 10);
    const sales = await reportModel.daily(target);
    const summary = summarizeSales(sales);
    return res.json({ status: true, date: target, ...summary });
  } catch (error) {
    next(error);
  }
};

const monthly = async (req, res, next) => {
  try {
    const year = Number(req.query.year) || new Date().getUTCFullYear();
    const month = Number(req.query.month) || new Date().getUTCMonth() + 1;
    const sales = await reportModel.monthly(year, month);
    const summary = summarizeSales(sales);
    return res.json({ status: true, year, month, ...summary });
  } catch (error) {
    next(error);
  }
};

export default { daily, monthly };
