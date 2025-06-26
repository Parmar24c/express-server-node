import apiResponse from './api_response.js';

export default function joiErrorResponse(error) {
  const message = error?.details?.[0]?.message || 'Validation failed';
  return apiResponse(false, `Validation failed: ${message}`, null, { error: message });
}
