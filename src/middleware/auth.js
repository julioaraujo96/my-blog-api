const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) =>{
    
    try 
    {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'YmxvZ2d5YXBw')
        const user = await User.findOne({_id:decoded._id, 'tokens.token':token})

        if(!user){
            throw new Error();
        }
        //dar acesso ao handler da rota do user para que não seja necessário ir buscar à base de dados novamente.
        req.token = token
        req.user = user
        next()
    } 
    catch (e) 
    {
        res.status(401).send({error:'Please Authenticate'})    
    }
}

module.exports = auth