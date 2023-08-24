import JWT from "jsonwebtoken"


export const authHandler = (req, res, next) => {
   try {
    let token = req.headers.authorization
    if(token){
        token = token.split(" ")[1];
        let user = JWT.verify(token,process.env.JWT_SECRET);
        req.userId = user.id
    }else{
        res.status(401).json({message: "Unauthorized User"})
    }
    next()
   } catch (error) {
    res.status(401).json({message: "Unauthorized User",error})
   }
  }
 