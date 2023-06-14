import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import createToken from "../../utils/createToken.js";
import ApiError from "../../errors/ApiErrors.js";

const registration = async (req, res, next) => {
  try {
    const { name, email, phonNumber, password } = req.body;
    if (!name || !email || !phonNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "You must give all data: name, email, phonNumber, password",
      });
    }
    const isUnique = await User.findOne({ email });
    if (isUnique) {
      return res.status(409).json({
        success: false,
        message: "Already registered with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phonNumber,
      password: hashedPassword,
      isVerified: false,
    });
    const createUser = await user.save();

    if (!createUser) {
      throw new ApiError(400, "Failed to registration!");
    }

    return res.status(201).json({
      success: true,
      message:
        "User created successfully. Please check your email and verify your account.",
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "You must give email, password.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }
    if (existingUser.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please check your email and verify your account.",
      });
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
      success: true,
      message: "Login successfully.",
      token,
    });
  } catch (error) {
    return next(error);
  }
};

export const CommonController = {
  registration,
  login,
};
