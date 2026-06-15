import { Prisma } from "@prisma/client";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Joi validation error (err from Joi.validate or thrown)
  if (err && (err.isJoi || err.name === "ValidationError")) {
    const details = err.details ? err.details.map((d) => d.message) : [err.message];
    return res.status(400).json({ status: false, errorType: "validation", message: "Validation Error", details });
  }

  // If middleware forwarded a structured validation error { error: [...]} from our validator wrapper
  if (err && err.error && Array.isArray(err.error)) {
    return res.status(err.status || 400).json({ status: false, errorType: "validation", message: "Validation Error", details: err.error });
  }

  // Prisma errors
 if (err instanceof Prisma.PrismaClientKnownRequestError) {
  if (err.code === "P2002") {
    return res.status(409).json({
      status: "failed",
      errors: [
        "Category name already exists"
      ]
    });
  }

  return res.status(400).json({
    status: false,
    errorType: "prisma",
    code: err.code,
    message: err.message
  });
}

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ status: false, errorType: "prisma", message: err.message });
  }

  // Not found
  if (err && (err.status === 404 || err.name === "NotFoundError" || /not found/i.test(err.message || ""))) {
    return res.status(err.status || 404).json({ status: false, errorType: "not_found", message: err.message || "Resource not found" });
  }

  // Fallback internal server error
  return res.status(err.status || 500).json({ status: false, errorType: "internal", message: err.message || "Internal Server Error" });
};

export default errorHandler;
