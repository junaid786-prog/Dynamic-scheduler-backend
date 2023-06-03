const nodemailer = require("nodemailer")
const CatchAsync = require("./CatchAsync")

exports.sendMail = async (to, content, res) => {
  try {
    let transporter = nodemailer.createTransport({
    //   host: "smtp.example.com",
    //   port: 587,
    //   secure: false, // upgrade later with STARTTLS
      service: "gmail",
      auth: {
        user: "junaidshoaib555@gmail.com",
        pass: "oucamljhsjdwqypi",
      },
    })

    transporter.verify((err, success) => {
      if (err) {
        console.log(err)
        console.log("not verified")
      }
    })

    await transporter.sendMail({
      from: "junaidshoaib555@gmail.com",
      to: to,
      subject: content.subject,
      text: content.content
    })
    return true
  } catch (err) {
    return false
  }
}
