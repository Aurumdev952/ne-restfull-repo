import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log("ERROR---------------------------", error);
  if (error) {
    const status = error.status || 500;
    const message =
      (error.code && error.code === 11000
        ? "Duplicate Error"
        : error.message) || "Something went wrong";
    return res.status(status).send({
      message,
      status,
      code: error.code,
    });
  }
  next();
};
