module.exports = class HttpResponse {
  static badRequest(paramMissing) {
    return { body: paramMissing, statusCode: 400 };
  }

  static internalError(error) {
    return { body: error, statusCode: 500 };
  }

  static unauthorizedError({ error }) {
    return { body: error, statusCode: 401 };
  }
};
