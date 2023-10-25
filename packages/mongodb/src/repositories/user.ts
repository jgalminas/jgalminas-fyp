import { User } from '../models/user';

export const findUserByEmail = async(email: string) => {
  return await User.findOne({
    email: email
  });
}

export const findUserById = async(id: string) => await User.findById(id);

export const createUser = async(email: string, password: string) => {
  
  const user = await User.create({
    email,
    password
  });

  await user.save();
  return user;
}