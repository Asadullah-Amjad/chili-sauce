import UserModel from "../models/User.model.js";
import ApiResponse from "../helpers/ApiResponses.js";
import { validationResult } from "express-validator";
import sendMailToUser from "../helpers/mailer.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const User_Controller = {
   register: async (req, res) => {
      const { name, email, password } = req.body;

      try {
         // Validations
         const errors = validationResult(req);
         console.log("erros", errors);

         if (!errors.isEmpty()) {
            return res.status(400).json(ApiResponse.validation(errors.array(), 400));
         }

         // check if user exists
         const isUserExist = await UserModel.findOne({ email: email.toLowerCase() });
         if (isUserExist) return res.status(400).json({ message: "User already exists. Please Choose Different Email" });

         // Fist Hash password 
         const salt = await bcrypt.genSalt(10)
         const hashPassword = await bcrypt.hash(password, salt)

         // Create user in Db

         const createUser = await new UserModel({
            name,
            email,
            password: hashPassword
         })

         await createUser.save()
         console.log("create USer ", createUser)



         // send verify email 
         sendMailToUser(createUser.email, 'VERIFY', createUser._id)


         return res.status(201).json({ message: ' Please Verify Your Email Address . Check Inbox' })
      } catch (error) {
         res.status(500).json({ message: error.message });
      }
   },
   login: async (req, res) => {
      const requestBody = req.body;
      if (!requestBody) return res.status(400).json({ message: "Invalid User Credentials" })

      const errors = validationResult(req);
      console.log("erros", errors);

      if (!errors.isEmpty()) {
         return res.status(400).json(ApiResponse.validation(errors.array(), 400));
      }

      try {
         // chech user is exist on databse or not
         const user = await UserModel.findOne({ email: requestBody.email })
         if (!user) return res.status(404).json({ message: "User not Found" })

         const decodedPassword = await bcrypt.compare(requestBody.password, user.password);
         if (!decodedPassword) return res.status(400).json({ message: 'Incorrect Password' })

         const GeneratedToken = await jwt.sign({
            name: user.name,
            email: user.email,
            id: user._id
         }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

         res.cookie('token', GeneratedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            maxAge: 3600000
         })

         return res.status(201).json({ message: 'Login Successfully', token: GeneratedToken })
      } catch (error) {

      }
   },
   verifyEmail: async (req, res) => {
      const param = req.params.id;
      try {
         console.log("request PArams id", param)
         return res.status(200).json({ message: 'Email Verified Successfully', id: param })
      } catch (error) {
         return res.status(500).json({ message: 'Internal Server Error' })
      }
   }
}
export default User_Controller;