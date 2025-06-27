type ApiResponse<T = any> = {
  status: boolean;
  message: string;
  data?: T;
} & Record<string, any>;

const apiResponse = <T = any>(
  status: boolean,
  message: string,
  data: T | null = null,
  otherOptions: Record<string, any> | null = null
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    status,
    message,
  };

  if (otherOptions !== null) {
    Object.assign(response, otherOptions);
  }

  if (data !== null) {
    response.data = data;
  }

  return response;
};

export default apiResponse;
