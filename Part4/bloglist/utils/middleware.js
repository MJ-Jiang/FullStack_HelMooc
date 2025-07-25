const jwt=require('jsonwebtoken')
const User=require('../models/user')
const tokenExtractor = (request, response, next) => {
 
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '') 
  }else{
    request.token=null
  }
  next()
}
const userExtractor=async(request,response,next)=>{
  try{
    const token=request.token
    if(!token){
      return response.status(401).json({error:'token missing'})
    }
    const decodedToken=jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
      return response.status(401).json({error:'User not found'})
    }
    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'user not found' })
    }
    request.user=user
    next()

  }catch(error){
    next(error)
  }

}
const errorHandler = (error, request, response, next) => {


  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({
      error: 'expected `username` to be unique'
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })

  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}
module.exports={errorHandler,tokenExtractor,userExtractor}