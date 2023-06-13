import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

const registration = async (req, res, next) => {
  try {
    const { name, email, phonNumber, password } = req.body;
    const isUnique = await User.findOne({ email });
    if (isUnique) {
      return res
        .status(201)
        .json({ message: "Already registered with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phonNumber,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        phonNumber: user.phonNumber,
        name: user.name,
        role: "user",
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );
    return res.status(201).json({
      message: "User created successfully.",
      token,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        phonNumber: existingUser.phonNumber,
        name: existingUser.name,
        role: existingUser.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );
    return res.status(201).json({
      message: "Login successfully.",
      token,
    });
  } catch (error) {
    return res.status(409).json({ message: error });
  }
};

export const UserController = {
  registration,
  login,
};
