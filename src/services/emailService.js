require("dotenv").config();
import nodemailer from "nodemailer";
let sendSimpleEmail = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Booking Care 👻" <rutatut2000@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line

    html: getBodyEmailHTML(dataSend), // html body
  });
};
let getBodyEmailHTML = (dataSend) => {
  if (dataSend.language === "vi") {
    return `<h2>Xin chào ${dataSend.patientName}</h2><p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên BookingCare.vn</p><p>Thông tin đặt lịch khám bệnh:</p><div>
        <b>Thời gian: ${dataSend.time}</b>
      </div><div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
      <p>Vui lòng kiểm tra thông tin và xác nhận, vui lòng click vào link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh.</p><div>
        <a href=${dataSend.Url} target="_blank">Click here</a>
      </div>`;
  }
  if (dataSend.language === "en") {
    return `<h2>Dear ${dataSend.patientName}</h2><p>You received this email because you booked an online medical appointment on BookingCare.vn</p><p>Information to schedule an appointment:</p><div>
        <b>Time: ${dataSend.time}</b>
      </div><div><b>Doctor: ${dataSend.doctorName}</b></div>
      <p>Please check the information and confirm, please click on the link below to complete the procedure to book an appointment.</p><div>
        <a href=${dataSend.Url} target="_blank">Click here</a>
      </div>`;
  }
};
module.exports = {
  sendSimpleEmail,
};
