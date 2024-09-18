const UserSchema = require('../models/UserSchema');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = (req, res) => {
    const {
      username,
      password,
    } = req.body;
    const user = new UserSchema({
      username,
      password,
    });
  
    user
      .save()
      .then((result) => {
        res.status(201).json({
          success: true,
          message: "Account Created Successfully",
          author: result,
        });
      })
      .catch((err) => {
        if (err.keyPattern) {
              return res.status(409).json({
                  success: false,
                  message: `The email already exists`,
          });
        }
        res.status(500).json({
          success: false,
          message: `Server Error`,
          err: err.message,
        });
      });
  };


const login = (req,res) =>{
    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    UserSchema.findOne({username}).then(async(result) => {
        if(!result){
            return res.status(403).json({
                success : false,
                message : `The userName doesn't exist or The password you’ve entered is incorrect`
            });
        };

        try{
            console.log(result);
            const valid = await bcrypt.compare(password, result.password);
            if(!valid){
                return res.status(403).json({
                    success: false,
                    message: `The email doesn't exist or The password you’ve entered is incorrect`,
                });
            }
            const payload = {
                userId: result._id
              }
        
              const options = {
                expiresIn : "6h"
              };
        
              const token = jwt.sign(payload, "WBUSF", options);
            res.status(200).json({
                success : true,
                message : `Valid Login credentials`,
                token: token

            });
        } catch (error){
            throw new Error(error.message);
        }
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            err : err.message
        })
    });
}

module.exports = {
    register,
    login
}