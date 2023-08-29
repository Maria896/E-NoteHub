import JWT from "jsonwebtoken"


export const authHandler = (req, res, next) => {
   try {
    let token = req.headers.authorization
    console.log(token);
    if(token){
        token = token.split(" ")[1];
        let user = JWT.verify(token,process.env.JWT_SECRET);
        console.log(user)
        req.userId = user.id
        console.log(req.userId)
    }else{
        res.status(401).json({message: "inside Unauthorized User"})
    }
    console.log(user)
    next()
   } catch (error) {
    res.status(401).json({message: "Internal server error",error})
   }
  }
 