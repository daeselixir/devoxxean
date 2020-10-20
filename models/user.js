const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your Name']
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:{
        type:String
    },
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength: 8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            //this only works on CREATE on save
            validator:function(el){
                return el === this.password
            },
            message:'Passwords are not the some!'
        }

    },  
    passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
    });

    userSchema.pre('save',async function(next){
        //Only run this function if password was actuality modified
        if(!this.isModified('password')) return next()
        //Has the password with cost 12
        this.password = await bcrypt.hash(this.password,12)
        //delete passwordConfirm fieldß
        this.passwordConfirm=undefined

        next()
    })

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
        return await bcrypt.compare(candidatePassword,userPassword)
    }

    userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
const User=mongoose.model('User',userSchema)

module.exports=User