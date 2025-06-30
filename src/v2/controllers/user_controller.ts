import { Request, Response } from 'express';
import User from '../../v1/models/user_model.js';
import bcrypt from 'bcryptjs';

export async function getAllUsers(_: Request, res: Response): Promise<any> {
  try {
    const users = await User.find().select('-password');
    res.sendData(true, 'All users fetched', users);
  } catch (err: any) {
    res.serverError('Failed to fetch users', err);
  }
}

export async function getActiveUsers(_: Request, res: Response): Promise<any> {
  try {
    const users = await User.find({ active: true }).select('-password');
    res.sendData(true, 'Active users fetched', users);
  } catch (err: any) {
    res.serverError('Failed to fetch active users', err);
  }
}

export async function getUserById(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    user
      ? res.sendData(true, 'User details fetched', user)
      : res.sendData(false, 'User not found');
  } catch (err: any) {
    res.serverError('Error fetching user', err);
  }
}

export async function updateUserDetails(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findById(id).select('-password');
    if (!user) return res.sendData(false, 'User not found');

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    await user.save();

    res.sendData(true, 'User details updated', user);
  } catch (err: any) {
    res.serverError('Update failed', err);
  }
}

export async function updateActiveStatus(req: Request, res: Response) : Promise<any>{
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(['_id', 'name', 'active', 'updatedAt']);
    if (!user) return res.sendData(false, 'User not found');

    user.active = req.body?.active ?? !user.active;
    await user.save();

    res.sendData(true, 'Active status updated', user);
  } catch (err: any) {
    res.serverError('Failed to update status', err);
  }
}

export async function changePassword(req: Request, res: Response) : Promise<any>{
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.sendData(false, 'User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.sendData(false, 'Old password is incorrect');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.sendData(true, 'Password changed successfully');
  } catch (err: any) {
    res.serverError('Password change failed', err);
  }
}

export async function deleteUser(req: Request, res: Response) : Promise<any>{
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    res.sendData(true, 'User deleted successfully');
  } catch (err: any) {
    res.serverError('Delete failed', err);
  }
}
