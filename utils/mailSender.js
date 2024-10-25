const nodemailer = require("nodemailer");
require("dotenv").config();


const mailSender = async({email,subject,body})=>{
    try {

        console.log(email);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            auth: {
              user: "dipanshuverma585@gmail.com",
              pass: "njqa btnf giiy bkcc",
            },
          });

          const mailOptions = {
            from: '"rentAcar" <support@rentacar.com>',
            to:email,
            subject,
            html:"<b>Hello world?</b>"
          };
         
          const info = await transporter.sendMail(mailOptions);

          return { error: false, message: "Email sent: " + info.messageId };

        
    } catch (error) {
        console.error("Error sending email:", error);
        return { error: true, message: error.message };
    }
}

module.exports  = mailSender