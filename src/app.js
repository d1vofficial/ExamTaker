require("dotenv").config();

const express = require('express');
const app = express();
const bcrypt = require("bcryptjs");

const auth = require("./middleware/auth");

const cookieParser = require("cookie-parser");
require("./db/conn");
const path = require('path');
const hbs = require("hbs");
const jwt = require("jsonwebtoken"); 

const Register = require("./models/register");
const Exam = require("./models/Exam");
const Response = require("./models/Response");
const port = process.env.PORT || 8000;


const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");



// console.log(partials_path);
// console.log(__dirname);

//routes
const adminRoute = require('./routers/adminRoute');


app.use(express.json()); //to use json 
app.use(cookieParser());
app.use(express.urlencoded({extended: false})); //to get data from form

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);


app.use('/admin',adminRoute); 
// console.log(process.env.SECRET_KEY);





app.get("/exam", async(req,res) => {


    try{
        
        const examObj = await Exam.findOne({isEnabled: true});
        // console.log(examObj);
        const quesArray = examObj.questions;
        
        // console.log(examObj[0].name);
        res.render("index", {
            exam: examObj,
            ques : quesArray,
            quesLen : quesArray.length
        });

        

    } catch(error)
    {
        console.log(error);
    }
});

// app.get("/exam", auth ,(req,res) => {

//     console.log(req.user._id);
//     res.render("exam")
// });

app.get("/logout", auth ,async(req,res) => {
    
    try{

        req.user.tokens = req.user.tokens.filter((curElement) => {
            return curElement.token !== req.token
        });

        res.clearCookie("jwt");
        console.log("logout successful");

        await req.user.save();
        res.render("login");

    }catch(error){
        res.status(500).send(error);
    }
});

app.get("/register", (req,res) => {
    res.render("register")
});

app.get("/login", (req,res) => {
    res.render("login")
});

app.post("/login", async(req,res) => {
    try{

        // console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;

        const userObject = await Register.findOne({email:email});

        const isMatch = await bcrypt.compare(password, userObject.password);

        const token = await userObject.generateAuthToken();
        
        res.cookie("jwt",token, {
            expires: new Date(Date.now() + 500000),
            httpOnly:true
            // secure: true
        });  //setting up cookie for users
        
        console.log("The token part "+token);
        // console.log(isMatch);
        if(isMatch)
            res.status(201).render("index");
        else
            res.send("Invalid Credentials");
            
    }catch(error) {
        res.status(400).send(error);
    }
});

app.post("/register", async(req,res) => {
    try{

        console.log(req.body);
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(password === confirmpassword)
        {
            const registerStudent = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                phone : req.body.txtEmpPhone,
                gender : req.body.gender,
                password : req.body.password,
                confirmpassword : req.body.confirmpassword
            })

            //password hash (see at register.js) 
            const token = await registerStudent.generateAuthToken();
            console.log("The token part "+token);

            res.cookie("jwt",token, {
                expires: new Date(Date.now() + 50000),
                httpOnly:true
            });  //setting up cookie for users

            const registered = await registerStudent.save();
            res.status(201).render(index);
        }
        else{
            res.send("passwords don't match"); 
        }
        
    } catch(error){
        res.status(400).send(error);
    }
});

app.post("/submitAns",async(req,res) => {
    
    try{

        res.send(req.body);

        const studentResponse = new Response({
            student_id : req.user._id,
            firstname : req.user.firstname,
            lastname : req.user.lastname,
            answer : req.body.answers
        })

        console.log(req.body.answers);
        // const ansSaved = await studentResponse.save();
    }catch(error){
        console.log(error);
    }
})

app.listen(port, ()=> {
    console.log(`Server running at port ${port}`);
});
 