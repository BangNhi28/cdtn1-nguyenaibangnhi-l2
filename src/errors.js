class AppError extends Error {
  constructor(status, error, message, fields) {
    super(message);
    this.status = status;
    this.error = error;
    this.fields = fields || [];
  }
}

module.exports = { AppError };
