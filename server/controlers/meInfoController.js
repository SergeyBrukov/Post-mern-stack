import User from './../model/User.js';
import bcrypt from 'bcrypt';

export const changePassword = async (req, res) => {
  console.log(req.user);
  try {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;
    console.log('userId', userId);
    const user = await User.findById({ _id: userId });
    console.log('user', user);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (oldPassword === newPassword) {
      return res.status(404).json({ message: 'Password the same as before' });
    }

    const examinationPassword = await bcrypt.compare(oldPassword, user.password);
    console.log(examinationPassword);
    console.log(oldPassword, user.password);
    if (!examinationPassword) {
      return res.status(404).json({ message: 'Password not valid' });
    }

    const newHashPassword = await bcrypt.hash(newPassword, 12);
    await User.updateOne({ password: newHashPassword });
    res.status(200).json({ message: 'Success change your password' });
  } catch (error) {
    return res.status(500).json({ message: 'Samesing were wrong' });
  }
};
