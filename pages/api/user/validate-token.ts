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
    case 'GET':
      return validateJWT(req, res);
    default:
      return res.status(400).json({ message: `Method ${req.method} Not Allowed` });
  }
}

const validateJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  let userId = '';

  try {
    userId = await jwt.isValidToken(token);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid token' });
  }

  await db.connect();
  const user = await User.findById(userId).lean();
  await db.disconnect();

  if (!user) return res.status(400).json({ message: 'User not exist' });

  const { _id, email, role, name } = user;
  return res.status(200).json({ token: jwt.signToken(_id, email), user: { email, role, name } });
};
