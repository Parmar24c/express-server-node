import { Request, Response } from 'express';
import { generateToken } from '../../common/helpers/generate_token.js';
import User from '../../v1/models/user_model.js';
import bcrypt from 'bcryptjs';

export async function signup(req: Request, res: Response): Promise<any> {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.sendData(false, "Email already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        res.sendData(true, "SignUp successfully", user);
    } catch (err: any) {
        res.serverError('Signup failed', err);
    }
}

export async function login(req: Request, res: Response): Promise<any> {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.sendData(false, 'Invalid email or password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.sendData(false, 'Invalid email or password');

        const token = generateToken({ userId: user._id });

        res.sendData(true, "Login successfully", user, { token });
    } catch (err: any) {
        res.serverError('Login failed', err);
    }
}
