import User from '../models/user_model.js';
import apiResponse from '../helpers/api_response.js';
import bcrypt from 'bcryptjs';

export async function getAllUsers(_, res) {
  try {
    const users = await User.find().select('-password');
    res.json(apiResponse(true, 'All users fetched', users));
  } catch (err) {
    res.status(500).json(apiResponse(false, 'Failed to fetch users', null, { error: err.message }));
  }
}

export async function getActiveUsers(_, res) {
  try {
    const users = await User.find({ active: true }).select('-password');
    res.json(apiResponse(true, 'Active users fetched', users));
  } catch (err) {
    res.status(500).json(apiResponse(false, 'Failed to fetch active users', null, { error: err.message }));
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password');
    user
      ? res.json(apiResponse(true, 'User details fetched', user))
      : res.json(apiResponse(false, 'User not found'));
  } catch (err) {
    res.status(500).json(apiResponse(false, 'Error fetching user', null, { error: err.message }));
  }
}

export async function updateUserDetails(req, res) {
  const { id } = req.params;

  try {
    const { name, email } = req.body;
    const user = await User.findById(id).select("-password");
    if (!user) return res.json(apiResponse(false, 'User not found'));

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    await user.save();

    res.json(apiResponse(true, 'User details updated', user));
  } catch (err) {
    res.status(500).json(apiResponse(false, 'Update failed', null, { error: err.message }));
  }
}

export async function updateActiveStatus(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select(['_id', 'name', 'active', 'updatedAt']);
    if (!user) return res.json(apiResponse(false, 'User not found'));

    user.active = req.body?.active ?? !user.active;
    await user.save();

    res.json(apiResponse(true, 'Active status updated', user));
  } catch (err) {
    res.status(500).json(apiResponse(false, 'Failed to update status', null, { error: err.message }));
  }
}

export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.json(apiResponse(false, 'User not found'));

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.json(apiResponse(false, 'Old password is incorrect'));

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json(apiResponse(true, 'Password changed successfully'));
  } catch (err) {
    res.status(500).json(apiResponse(false, 'Password change failed', null, { error: err.message }));
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.json(apiResponse(true, 'User deleted successfully'));
  } catch (err) {
    res.status(500).json(apiResponse(false, 'Delete failed', null, { error: err.message }));
  }
}
