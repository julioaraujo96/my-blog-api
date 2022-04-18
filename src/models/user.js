const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password:{
        type:String, 
        required:true,
        trim:true,
        minLength:7,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Cannot use "password" as a password.')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    }
});

//findByCredentials will call userSchema.statics.findByCredentials 
userSchema.statics.findByCredentials = async (email,password) => {

    const user = await User.findOne({ email });  //findOne finds only one value where email:email 

//no user = error
    if(!user)
    {
        throw new Error('Unable to Login');
    }

    //compare hashed password to the user hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    //no match => error
    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;

}


//post if it's after an event, name of the event and function to run. no arrow function because they don't bind this.
//next needs to be called to tell the process is over.

//PLain text password hashing
userSchema.pre('save', async function (next){
    
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

})

const User = mongoose.model('User', userSchema);

module.exports = User;