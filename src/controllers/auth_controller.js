import User from '../models/user_model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import apiResponse from '../helpers/api_response.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export async function signup(req, res) {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.sendData(false, "Email already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        res.sendData(true, "SignUp Successfully", user);
    } catch (err) {
        res.serverError('Signup failed', err);
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.sendData(false, 'Invalid email or password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.sendData(false, 'Invalid email or password');

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

        res.sendData(true, "Login successfully", user, { token: token });
    } catch (err) {
        res.serverError('Login failed', err);
    }
}
