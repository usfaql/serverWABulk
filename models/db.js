const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://usfaqll:lhCZp7Feyrs8kW74@cluster0.drkzmdw.mongodb.net/phoneNumberDB').then((result) => {
    console.log("DB Ready To Use");
}).catch((err) => {
    console.log(err);
});