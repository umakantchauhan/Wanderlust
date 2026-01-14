class ExpressError extends Error {
  //gpt detailed explanation
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
module.exports = ExpressError;
