const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const { getMaxListeners } = require('process');
require('dotenv').config();

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.locals.layout = false;

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>First Name: ${req.body.name}</li>
      <li>Last Name: ${req.body.lname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone Number: ${req.body.number}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 25,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <anishaguptaofficial@gmail.com>', // sender address
        to: 'info@redpositive.in', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello there?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', { msg: 'Email has been sent' });
    });
});

app.listen(3000, () => console.log('Server started...'));