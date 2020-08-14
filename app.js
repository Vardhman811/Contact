const express=require('express')
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
const serviceAccount = {
  "type": "service_account",
  "project_id": "contact-84d2d",
  "private_key_id": process.env.K1,
  "private_key":  process.env.K2,
  "client_email":  process.env.K3,
  "client_id":  process.env.K4,
  "auth_uri":  process.env.K5,
  "token_uri":  process.env.K6,
  "auth_provider_x509_cert_url":  process.env.K7,
  "client_x509_cert_url": process.env.K8
}

var d = new Date();
var n = d.getTime();
n="a"+n

const app=express()
const port=process.env.PORT
app.use(bodyParser.urlencoded({ extended: true }));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    });
const db = admin.firestore();
const messageRef = db.collection('sampleData').doc(n);


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });
  
 

app.set('view engine','ejs')
app.use(express.static('./public'))

app.get('',async (req,res)=>{
    res.render('index')
  })
app.get('/sent',async (req,res)=>{
    res.render('new')
})


app.post('/send',async(req,res)=>{
    var{ email,phone,message,name} = req.body
    var responce={ name,email,phone,message}
    const deta = await messageRef.set(responce,{ merge: true });
    var mailOptions = {
        from: process.env.EMAIL,
        to: 'info@redpositive.in', 
        subject: 'Contact Us',
        text: `Mr ${name} - Email ${email} - Phone Number ${phone} has approached us with following message "" ${message} "".`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    console.log(responce)
    res.redirect('/sent')
})

  app.listen(port,()=>{
      console.log(port)
}) 




   
