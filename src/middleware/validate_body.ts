import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export default function validateBody(schema: ObjectSchema): any {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return res.joiValidationError(error);
        }

        req.body = value; // cleaned & validated
        next();
    };
}
