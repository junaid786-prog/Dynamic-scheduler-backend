const nodemailer = require("nodemailer")
const CatchAsync = require("./CatchAsync")

exports.sendMail = async (to, content, res) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.ionos.com",
      port: 465,
      secure: true, // upgrade later with STARTTLS
      service: "email",
      auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD,
      },
    })

    transporter.verify((err, success) => {
      if (err) {
        console.log(err)
        console.log("not verified")
      }
    })

    await transporter.sendMail({
      from: process.env.MAIL_SENDER,
      to: to,
      subject: content.subject,
      text: content.content
    })
    return true
  } catch (err) {
    return false
  }
}
