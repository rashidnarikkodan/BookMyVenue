import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ['user', 'owner', 'admin'],
      default: 'user',
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    isVerified: {
      type: Boolean,
      defualt: false,
    },

    googleId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
