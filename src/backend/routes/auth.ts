import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Generate JWT token
const generateToken = (userId: string, email: string, username: string): string => {
  return jwt.sign(
    { id: userId, email, username },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw createError('User with this email or username already exists', 400);
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.username);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw createError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw createError('Account is deactivated', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createError('Invalid credentials', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.username);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          lastLogin: user.lastLogin
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { firstName, lastName, avatar } = req.body;
    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw createError('Current password and new password are required', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw createError('Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    // Generate new token
    const token = generateToken(user._id.toString(), user.email, user.username);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { token }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
