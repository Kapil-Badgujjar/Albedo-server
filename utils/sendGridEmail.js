// This file uses sendgrid email api
import {} from "dotenv/config";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_SK);

function sendSignupMail(email) {
  sgMail
    .send({
        to: email, // Change to your recipient
        from: {
            name: 'Kapil',
            email: 'kapilbatra0786@gmail.com' // Change to your verified sender
        },
        subject: 'Acount created on Albedo task management application',
        text: 'Your Albedo account is successfully created. Enjoy your account features to manage tasks.',
        html: '<strong>Your Albedo account is successfully created. Enjoy your account features to manage tasks.</strong>',
      })
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

function sendTaskAssignedMail(email) {
  sgMail
    .send({
        to: email, // Change to your recipient
        from: {
            name: 'Kapil',
            email: 'kapilbatra0786@gmail.com' // Change to your verified sender
        },
        subject: 'New Task Recieved',
        text: 'A new task is received',
        html: '<strong>A new task is recieved.</strong>',
      })
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

export { sendSignupMail, sendTaskAssignedMail };
