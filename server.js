const express = require("express");
require("./models/db.js");
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrController = require('./controllers/Phones.js');


const app = express();
const PORT = 5000;

const phoneRouter = require('./routes/Phones');


app.use(cors());

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use('/', phoneRouter);
const server = http.createServer(app);
const io = new Server(server ,{cors:{origin:"*"}});





// Define routes


/*
app.post('/password', (req, res) =>{
  const {password} = req.body;

  
})
*/
server.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
