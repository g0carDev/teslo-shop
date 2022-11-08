import { db } from '@database';
import { User } from '@models';

export const checkUserOauth = async (oAuthEmail: string, oAuthname: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });

  if (user) {
    await db.disconnect();
    const { _id, name, email, role } = user;
    return { _id, name, email, role };
  }

  const newUser = new User({ email: oAuthEmail, name: oAuthname, password: 'oauth', role: 'client' });
  await newUser.save();
  await db.disconnect();

  const { _id, name, email, role } = newUser;
  return { _id, name, email, role };
};
