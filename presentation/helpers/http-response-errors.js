module.exports = class HttpResponse {
  static badRequest(paramMissing) {
    return { body: paramMissing, statusCode: 400 }
  }
}
