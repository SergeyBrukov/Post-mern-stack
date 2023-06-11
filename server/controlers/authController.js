import User from './../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD;

//Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body, '<<<');
    const candidate = await User.findOne({ email });
    if (candidate) {
      return res.status(404).json({ message: 'This user was created' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: passwordHash });
    await newUser.save();
    const token = jwt.sign({ userId: newUser.id }, TOKEN_PASSWORD);
    res.status(201).json({ user: newUser, token, userId: newUser.id, message: 'Register sucsess' });
  } catch (error) {
    res.json(500).json({ message: 'Miss for create user' });
  }
};
//Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const examinationPassword = await bcrypt.compare(password, user.password);

    if (!examinationPassword) {
      return res.status(400).json({ message: 'You wrote wrong data' });
    }

    const token = jwt.sign({ userId: user.id }, TOKEN_PASSWORD);
    res.status(200).json({ token, user, userId: user.id, message: 'Sucsess' });
  } catch (error) {
    res.json(500).json({ message: 'Miss for login user' });
  }
};

//Get me user
export const getMe = async (req, res) => {
  console.log(req.user);
  try {
    const { userId } = req.user;
    const user = await User.findById({ _id: userId });
    const token = jwt.sign({ userId: user.id }, TOKEN_PASSWORD);
    res.status(200).json({ user, userId: user.id, token, message: 'Sucsess' });
  } catch (error) {
    res.json(500).json({ message: 'Miss for receive user' });
  }
};
