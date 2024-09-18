const express = require("express");
const bodyParser = require('body-parser');
require("./models/db.js");
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pkg = require('whatsapp-web.js');
const { Client, LocalAuth } = pkg;
const qrcode = require('qrcode-terminal');


const app = express();
const PORT = 5000;

const phoneRouter = require('./routes/Phones');



app.use(cors({
  origin: ['https://serverwabulk.onrender.com'],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

app.use('/', phoneRouter);
const server = http.createServer(app);
const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: ['https://serverwabulk.onrender.com'],
    credentials: true
  }
});

/*
const client = new Client({ authStrategy: new LocalAuth() });

client.on('qr', async (qr) => {
  const qrImage = await qrcode.toDataURL(qr);
  app.get('/qr', (req, res) => {
    res.send(`<img src="${qrImage}" alt="QR Code">`);
  });
  console.log('QR RECEIVED');
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('authenticated', () => {
  console.log('Client is authenticated!');
});

client.on('auth_failure', msg => {
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
});

client.initialize();



app.post('/password', (req, res) =>{
  const {password} = req.body;

  
})
*/
server.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
