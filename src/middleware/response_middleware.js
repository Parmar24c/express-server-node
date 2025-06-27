import apiResponse from '../helpers/api_response.js';
import Logger from '../helpers/logger.js';

export function customResponseMiddleware(req, res, next) {
    Logger.request(req);

    res.sendData = (success, message, data = null, other = null) => {
        Logger.response(200, message);
        return res.json(apiResponse(success, message, data, other));
    };

    res.joiValidationError = (error) => {
        const message = error?.details?.[0]?.message || 'Validation failed';
        Logger.response(200, `Validation failed: ${message}`);
        return res.json(apiResponse(false, `Validation failed: ${message}`, null, { error: message }));
    };

    res.serverError = (message, error) => {
        Logger.response(500, `${message} | ${error?.message}`);
        return res.status(500).json(apiResponse(false, message, null, { error: error?.message }));
    };

    res.bad = (message, error) => {
        Logger.response(400, `${message}`);
        return res.status(400).json(apiResponse(false, message, null, { error: error?.message }));
    };

    res.unauthorized = (message, error = null) => {
        Logger.response(401, message);
        return res.status(401).json(apiResponse(false, message, null, { error: error?.message}));
    };

    next();
}
