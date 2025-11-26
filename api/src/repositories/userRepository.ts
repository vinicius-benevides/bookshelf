import User, { IUser } from '../models/User';

export const userRepository = {
  create: (data: Pick<IUser, 'name' | 'email' | 'password'>) => User.create(data),
  findByEmail: (email: string) => User.findOne({ email }),
  findById: (id: string) => User.findById(id),
};

export type UserDocument = Awaited<ReturnType<typeof userRepository.create>>;
