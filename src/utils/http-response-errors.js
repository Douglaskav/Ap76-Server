module.exports = class HttpResponseErrors {
  static badRequest(paramMissing) {
    return { body: { error: paramMissing }, statusCode: 400 };
  }

  static internalError(error) {
    return { body: { error }, statusCode: 500 };
  }

  static unauthorizedError(error) {
    return { body: { error }, statusCode: 401 };
  }

  static conflictError(error) {
    return { body: { error }, statusCode: 409 };
  }
};
