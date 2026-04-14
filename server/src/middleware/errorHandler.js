export function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  } else {
    console.error(message);
  }
  res.status(status).json({
    message,
    ...(err.errors && { errors: err.errors }),
  });
}

export function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}
