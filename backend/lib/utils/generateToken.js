import jwt from 'jsonwebtoken';


export const generateTokenAndSetCookie=(id,res)=>{
    const token = jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '10d'
    })
    res.cookie("token",token,{
        maxAge: 10*24*60*60*1000,
        httpOnly:true, //cannot be accessed by client side script && prevent XSS attacks
        sameSite:"strict", //protects from CSRF attacks
        secure: process.env.NODE_ENV === 'production' ? true : false
    })
}