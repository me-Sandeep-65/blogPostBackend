import jwt from "jsonwebtoken";

const verifyModeratorToken = (req, res, next) => {
    if (req.cookies.Authorization) {
        const token = req.cookies.Authorization.split(" ")[1];
        // console.log("token: ", token)
          
        jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
            if (error || data.role !== 'moderator') {
                res.status(401).json({message: "Unauthorized."});
                return;      
            }
            // console.log("parsed token is")
            // console.log(data);
            else{
                req.user = data;
                next();
            }
        });
          
    } else {
        res.status(401).json({message: "Unauthorized."});
        return; 
    }
};

export default verifyModeratorToken;