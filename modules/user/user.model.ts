// modules/user/user.model.ts
import { Schema, model, models, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IUserModel } from './user.interface';
import config from '@/app/lib/config';

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
toJSON: {
  transform: function (doc, ret: any) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
},

  }
);

// --- Mongoose Middleware: Hash password before saving ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = Number(config.bcrypt_salt_rounds || 12);
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err: any) {
    next(err);
  }
});

// --- Mongoose Instance Method: Compare password ---
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model overwrite in Next.js hot-reload
const User = models.User || model<IUser, IUserModel>('User', userSchema);

export default User;