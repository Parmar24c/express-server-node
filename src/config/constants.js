import dotenv from 'dotenv';
dotenv.config();

const APP_NAME = 'ExpressApp';
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

const PAGINATION = Object.freeze({
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
});

const DB = Object.freeze({
    MONGO_URI: process.env.MONGO_URI || '',
});

const SHOW_API_LOGS = true;

const ENV = Object.freeze({
    IS_DEV: process.env.NODE_ENV !== 'production',
    SHOW_LOGS: SHOW_API_LOGS && (process.env.NODE_ENV !== 'production'),
});

const Constants = Object.freeze({
    APP_NAME,
    JWT_SECRET,
    PAGINATION,
    DB,
    SHOW_API_LOGS,
    ENV,
});

export default Constants;
