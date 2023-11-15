// import { Injectable } from '@nestjs/common';

// const accountSid = '';
// const authToken = '';
// const client = require('twilio')(accountSid, authToken);

// @Injectable()
// export class WhatsAppService {
//   async sendMessage(to: string, message: string) {
//     try {
//       await client.messages
//         .create({
//           from: 'whatsapp:+14155238886',
//           body: 'Hello, there!',
//           to: 'whatsapp:+6287775440461',
//         })
//         .then((message) => console.log(message.sid));
//     } catch (error) {
//       console.error('Error sending message:', error);
//       return false;
//     }
//   }

//   async sendInitialMessage(to: string, message: string) {
//     try {
//       // Kirim pesan pertama untuk meminta izin
//       const messageResult = await client.messages.create({
//         from: 'whatsapp:+15088827367',
//         body: 'Please reply to this message to give permission to receive further messages.',
//         to: `whatsapp:${to}`,
//       });

//       console.log('Initial message sent. SID:', messageResult.sid);
//       return true;
//     } catch (error) {
//       console.error('Error sending initial message:', error);
//       return false;
//     }
//   }
// }
