const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require('fs');


const mailSender = async ({ email, subject, token }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: "brr9096005866@gmail.com",
        pass: "ecwq cdwj optm pzuz",
      },
    });


    const verificationLink = `http://localhost:3000/verify/${token}`;

      const htmlTemplate = await fs.readFileSync('./emailFiles/signupEMail.html', 'utf-8')
      .replace('{{username}}', "Bharat Rozodkar")
      .replace('{{verificationLink}}', verificationLink);

    const mailOptions = {
      from: '"rentAcar" <support@rentacar.com>',
      to: email,
      subject,
      html: htmlTemplate
    };

    const info = await transporter.sendMail(mailOptions);

    return { error: false, message: "Email sent: " + info.messageId };


  } catch (error) {
    console.error("Error sending email:", error);
    return { error: true, message: error.message };
  }
}

module.exports = mailSender