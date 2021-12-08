"use strict";
const nodemailer = require("nodemailer");
var  testAccount =  nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',//这是qq邮箱
    //端口
    port: 465,
    secure: true,
    auth: {
        // 发件人邮箱账号
        user: '18784771@qq.com', 
        //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
        pass: 'kjbktzedyqohbhbj'  
    }
  });

// 邮件信息
// 发送邮件
function send(mail, code) {
    const mailObj = ({
        from: { name: 'Name', address: '18784771@qq.com' },
        to: mail, // list of receivers
        subject: "Verification code", // Subject line
        text: `Your verification code is:${code}, Valid for 5 minutes`, // plain text body
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailObj, (err, data) => {
            if (err) {
                reject()
            } else {
                resolve()
            }
        });
    })
}
// 发送点餐信息
function sendOrderTime(mail, time,code) {
    const mailObj = ({
        from: { name: 'Name', address: '18784771@qq.com' },
        to: mail, // list of receivers
        subject: "pick up time", // Subject line
        text: `Your pick up time is:${time},order number is:${code}`, // plain text body
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailObj, (err, data) => {
            if (err) {
                reject()
            } else {
                resolve()
            }
        });
    })
}
// 发送点餐信息
function sendOrderError(mail, code) {
    const mailObj = ({
        from: { name: 'Name', address: '18784771@qq.com' },
        to: mail, // list of receivers
        subject: "Meal time", // Subject line
        text: `Café is closed. Thank you for your order!`, // plain text body
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailObj, (err,ta) => {
            if (err) {
                reject()
            } else {
                resolve()
            }
        });
    })
}
module.exports = { send ,sendOrderTime}