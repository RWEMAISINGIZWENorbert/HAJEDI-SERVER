import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req,res,next) => {
    try {
         
        const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

        if(!token){
            return res.status(401).json({
                msg: "Invalid Token",
                error: true
            });
        }

        if(!process.env.ACCESS_TOKEN_SECRET_KEY){
            return res.status(401).json({
                msg: "The Access Token secret key those not found",
                error: true
            }); 
        }

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET_KEY,
            async (err, decoded) => {
              if(err){
                // throw new Error("Error", err);       
                console.log("Error", err);       
              }
              
              const user = await User.findById(decoded.id);
              req.userId = user._id;
              next();
            }
        );
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({
            msg: "Error occured please try again late",
            error: true
        })
    }
}

export default authMiddleware;