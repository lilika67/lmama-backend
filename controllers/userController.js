import UserModel from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import sendEmail from '../middlewares/sendEmail.js';

export const SignUp = async (req, res, next) => {
  try {
    const { Name, email, Password } = req.body;

    console.log("SignUp request received with body:", req.body); // Add logging for debugging

    const userExists = await UserModel.findOne({ email: email });
    
    if (userExists) {
      return res.status(401).json("User with this email already exists");
    } else {
      const hashedPassword = bcryptjs.hashSync(Password, 10);

      const newUser = new UserModel({
        Name: Name,
        email: email,
        Password: hashedPassword,
      });

      const savedUser = await newUser.save();

      // Use the Name to personalize the email
      const subject = `Welcome to LMAMA`;
      const message = `Dear ${Name},\n\nYou have successfully created your account! Thank you for joining the large community of Lmama. We are happy to welcome you aboad!`;

      await sendEmail(email, subject, message);
      return res.status(200).json({ message: "Account created!", savedUser });
    }
  } catch (error) {
    console.error(error);
    console.log(error);
    res.status(500).json(error.message);
  }
};

export const SignIn = async (req, res, next) => {
  const { email, Password } = req.body;
  console.log("SignIn request received with body:", req.body); // Add logging for debugging
  try {
    const validUser = await UserModel.findOne({ email: email });

    if (!validUser) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Ensure the password field in the schema is correctly named (case-sensitive)
    const validPassword = bcryptjs.compareSync(Password, validUser.Password); // Make sure it's `validUser.Password` not `validUser.password`
    
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "You signed in successfully", user: validUser });
    
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await UserModel.find({});
    if(!allUsers || allUsers.length === 0){
      return res.status(404).json({
        message: "No users found!"
      });
    } else {
      res.status(200).send({
        allUsers
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
