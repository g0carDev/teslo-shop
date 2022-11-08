import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db } from '@database';
import { User } from '@models';
import { jwt, validations } from '@utils';
import type { IUserLogin } from '@interfaces';

type Data =
  | { message: string }
  | IUserLogin

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res);
    default:
      return res.status(400).json({ message: `Method ${req.method} Not Allowed` });
  }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { name, email, password } = req.body;
  await db.connect();
  const user = await User.findOne({ email });

  {/* VALIDATIONS */}
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  if (name.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters long' });
  if(!validations.isValidEmail(email)) return res.status(400).json({ message: 'Email is not valid' });
  if (user) {
    await db.disconnect();
    return res.status(400).json({ message: 'Invalid email or password - EMAIL' });
  }

  const newUser = new User({
    name,
    email: email.toLowerCase(), 
    password: bcrypt.hashSync(password),
    role: 'client',
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Review logs on server' });
  }

  const { _id, role } = newUser;
  const token = jwt.signToken(_id, email);

  return res.status(200).json({ token, user: { email, role, name } });
};
