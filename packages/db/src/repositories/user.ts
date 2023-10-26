import { eq } from "drizzle-orm";
import { db } from "../db";
import { User, user } from "../schema/user";
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

export const findUserByEmail = async(email: string): Promise<User | null> => {

  const result = await db.select()
    .from(user)
    .where(
      eq(user.email, email)
    )
    .limit(1);

  return result[0];  
}

export const findUserById = async(id: string): Promise<User | null> => {
  
  const result = await db.select()
    .from(user)
    .where(
      eq(user.id, id)
    )
    .limit(1);

  return result[0]; 
};

export const createUser = async(email: string, password: string): Promise<User> => {
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const id = nanoid();

  const r = await db.insert(user)
  .values({
    id,
    email,
    password: hashedPassword
  });

  console.log((r.columns));
  

  const result = await db.select()
  .from(user)
  .where(
    eq(user.id, id)
  )
  .limit(1);

  return result[0]; 

}