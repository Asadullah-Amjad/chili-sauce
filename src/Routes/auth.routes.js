import express from "express";
import User_Controller from "../Controllers/User.Controller.js";
import validationMiddleware from '../middlewares/registrationValidations.js'
const AuthRouter = express.Router();
AuthRouter.post("/register", validationMiddleware.RegistrationValidation, User_Controller.register);
AuthRouter.post("/login", validationMiddleware.LoginValidation, User_Controller.login);
AuthRouter.post("/verifyEmail", User_Controller.verifyEmail);
export default AuthRouter;