const mongoose = require('mongoose');
const validator = require('validator');

const usersSchema = new mongoose.Schema({
    fname : {
        type : String,
        required : true,
        trime: true
    },
    lname: {
        type : String,
        required : true,
        trime: true
    },
    email: {
        type : String,
        required : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    mobile : {
        type:String,
        required:true,
        unique:true,
        minLength:10,
        maxLength:10,
    },
    gender:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    dateCreated:Date,
    dateUpdated:Date
})

const User = new mongoose.model('User_Data',usersSchema);

module.exports = User;