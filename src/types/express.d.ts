import { apiResponse } from '../helpers/api_response'; // adjust if needed
import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Response {
      sendData: (success: boolean, message: string, data?: any, other?: object | null) => Response;
      joiValidationError: (error: any) => Response;
      serverError: (message: string, error: any) => Response;
      bad: (message: string, error: any) => Response;
      unauthorized: (message: string, error?: any) => Response;
    }
    interface Request {
      user: any?,
    }
  }
}
