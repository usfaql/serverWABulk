const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');

const {
    saveNumber,
    getNumberByName,
    getAllCountry,
    downloadAllData,
    downloadDataByCountry,
    getCountCountry,
    getAllNumberByAllCountry,
    getNumberByCollection
    //checkWhatsApp,
    //getQrCode
    } = require("../controllers/Phones");
const {register, login} = require('../controllers/Users.js');
const {authentication} = require("../middleware/authentication.js");


    const phoneRouter = express.Router();

    phoneRouter.post("/usfaql2001/dfe/register", register);
    phoneRouter.post("/login", login);
    phoneRouter.post('/save-number',saveNumber);
    phoneRouter.get('/getnumberbyname/:country',authentication,getNumberByName)
    phoneRouter.get('/getallcountry/',authentication,getAllCountry);
    phoneRouter.get('/getall/',authentication,getAllNumberByAllCountry);

    phoneRouter.get('/download-csv',authentication,downloadAllData);
    phoneRouter.get('/download-csv/:country',authentication,downloadDataByCountry);
    phoneRouter.get('/getcountcountry',authentication,getCountCountry);
    phoneRouter.post('/getcollection', authentication, getNumberByCollection);
    //phoneRouter.post('/check-whatsapp',authentication,checkWhatsApp);
    //phoneRouter.get('/qr', getQrCode);

    module.exports = phoneRouter;