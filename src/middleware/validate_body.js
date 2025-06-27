export default function validateBody(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

        if (error) {
            return res.joiValidationError(error);
        }

        req.body = value; // cleaned & validated
        next();
    };
}
