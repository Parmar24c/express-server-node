const apiResponse = (status, message, data = null, otherOptions = null) => {
  const response = {
    status,
    message,
  };
  
   if (otherOptions !== null) {
    Object.assign(response, otherOptions);
    // OR: response = { ...response, ...otherOptions };
  }

  if (data !== null) {
    response.data = data;
  }

  return response;
};

export default apiResponse;
