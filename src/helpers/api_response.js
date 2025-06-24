let apiResponse = (status, message, data = null, otherOptions = null) => ({
  'status': status,
  'message': message,
  "data": data,
  ...otherOptions,
});

module.exports = apiResponse;