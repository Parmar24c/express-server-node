const apiResponse = (status, message, data = null, otherOptions = null) => {
  const response = {
    status,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (otherOptions !== null) {
    Object.assign(response, otherOptions);
    // OR: response = { ...response, ...otherOptions };
  }

  return response;
};

export default apiResponse;
