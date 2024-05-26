import bycrypt from 'bcryptjs';
import UserModel from '../models/User.model.js';
import mailer from 'nodemailer';
import { promisify } from 'util';


const sendMailToUser = async (email, emailType, userId) => {

   try {
      // hash user id to generate token
      const salt = await bycrypt.genSalt(20);
      const hashedToken = await bycrypt.hash(userId.toString(), salt)


      //  Codium Logic 
      const user = await UserModel.findOne({ _id: userId });
      if (!user) {
         console.log("User not found");
         return;
      }

      if (emailType === 'VERIFY') {
         user.verifyToken = hashedToken;
         user.verifyTokenExpires = Date.now() + 3600000;
      } else if (emailType === 'RESET') {
         user.resetPasswordToken = hashedToken;
         user.resetPasswordTokenExpires = Date.now() + 3600000;
      } else {
         console.log("Invalid emailType");
         return;
      }

      await user.save();


      // Create Transporter 
      // Promisify sendMail
      var transporter = mailer.createTransport({
         host: "sandbox.smtp.mailtrap.io",
         port: 2525,
         auth: {
            user: "f52b64e50b5549",
            pass: "1edee20e707de8"
         }
      });
      // const sendMailAsync = promisify(mailer.createTransport({
      //    host: "sandbox.smtp.mailtrap.io",
      //    port: 2525,
      //    auth: {
      //       user: "f52b64e50b5549",
      //       pass: "1edee20e707de8"
      //    }
      // }).sendMail);

      // Generate HTML content ahead of time

      const emailSubject = emailType === 'VERIFY' ? 'Please Verify Your Email Address' : 'Please Rest Your Password';
      const emailLink = emailType === 'VERIFY' ? `http://localhost:5173/verifyemail/${hashedToken}` : `http://localhost:5173/reset/${hashedToken}`;
      const emailContent = `<h1>${emailSubject}</h1><p>To ${emailType === 'VERIFY' ? 'verify your email address' : 'reset your password'} Please click this link <a href="${emailLink}">Click Here</a></p>`;

      // mail options

      const mailOptions = {
         from: 'info@zoash.resturant.com <Zo@sh Resturant',
         to: email,
         subject: emailSubject,
         html: emailContent
      }

      // await sendMailAsync(mailOptions)
      const mailerResponse = await transporter.sendMail(mailOptions);
      return mailerResponse;
   } catch (error) {
      console.log("Catch mailer error", error.message)

   }


}
export default sendMailToUser;