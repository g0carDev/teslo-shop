import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db } from '@database';
import { User } from '@models';
import { jwt } from '@utils';
import type { IUserLogin } from '@interfaces';

type Data =
  | { message: string }
  | IUserLogin

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return loginUser(req, res);
    default:
      return res.status(400).json({ message: `Method ${req.method} Not Allowed` });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email, password } = req.body;
  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();
  if (!user) return res.status(400).json({ message: 'Invalid email or password - EMAIL' });
  if (!bcrypt.compareSync(password, user.password!)) {
    return res.status(400).json({ message: 'Invalid email or password - PASSWORD' });
  }
  const token = jwt.signToken(user._id, user.email);
  const { role, name } = user;
  return res.status(200).json({ token, user: { email, role, name } });
};
