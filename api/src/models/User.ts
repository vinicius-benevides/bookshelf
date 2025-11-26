import bcrypt from 'bcryptjs';
import { HydratedDocument, Schema, model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  comparePassword(candidate: string): Promise<boolean>;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 */
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  const user = this as HydratedDocument<IUser>;
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default model<IUser>('User', userSchema);
