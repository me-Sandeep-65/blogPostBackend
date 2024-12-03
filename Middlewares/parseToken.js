import jwt from "jsonwebtoken";

const parseToken = (req, res, next) => {
    if (req.cookies.Authorization) {
        const token = req.cookies.Authorization.split(" ")[1];
        // console.log("token: ", token)
          
        jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
            if (error) {
                req.err={
                    message: "Not a valid Token."
                }
                next();      
            }
            // console.log(user);
            req.user = data;
        });
          
    } else {
        req.err={
            message: "Not a valid Token."
        }
    }

    next();
};

export default parseToken;