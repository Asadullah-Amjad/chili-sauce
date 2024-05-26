import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
   },
   verified: {
      type: Boolean,
      default: false,
   },
   verifyToken: {
      type: String,
   },
   verifyTokenExpires: {
      type: Date,
   },
   resetPasswordToken: {
      type: String,
   },
   resetPasswordTokenExpires: {
      type: Date,
   },
   isAdmin: {
      type: Boolean,
      default: false
   },
   role: {
      type: String,
      default: "customer"
   }

}, { timestamps: true });
const UserModel = mongoose.model("users", userSchema)
export default UserModel;