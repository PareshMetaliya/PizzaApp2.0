import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";


// Signup - User
// POST: /api/users/register - login not required  
export const registerUser = async (req, res) => {

 
  try {
    const { name, email, password } = req.body;

    // Check user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists..." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);

    // Create New User
    const newUser = await User.create({
      name,
      email,
      password: hasedPassword,
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({success: false, message: "Server Error" });
  }
};


// Login User 
// POST: /api/users/login - login not required  
 export const loginUser = async (req,res)=>{

    try {

        const {email,password} = req.body;

        // check if User available or not 
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false, message:"Invalid credentials"})
        }


        // Compare Password 
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({success: false, message: "Invalid credentials" });
        }

        //Generate Token
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});

        res.status(200).json({success:true,token,message:"Login Successfully...!!"})
        
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error" });
    }

 }


//  Get User 
// GET : /api/users/getuser - login required 
 export const getUser = async (req, res) => {
  try {
    // `req.user` is set by `loginRequired` middleware
   
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({success: false, message: "Server Error" });
  }
};
