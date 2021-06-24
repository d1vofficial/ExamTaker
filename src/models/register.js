const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const studentSchema = new mongoose.Schema({
      
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    gender : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    confirmpassword : {
        type : String,
        required : true
    },
    tokens:[{
        token:{
            type : String,
            required:true
        }
    }]
})

studentSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({id: this._id}, process.env.SECRET_KEY);
        console.log(token);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;

    } catch(error){
        res.send("THe error part "+error);
        console.log()("THe error part "+error);
}
}

studentSchema.pre("save", async function(next){
    
    if(this.isModified("password")){
        console.log(this.password);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(this.password);

        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);;
    }

    next();
})

const Register = new mongoose.model("Register",studentSchema);

module.exports = Register;