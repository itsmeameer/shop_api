const Users = require('../../models/user.model');
const jwt = require('jsonwebtoken');


module.exports.login = async (req, res) => {
    try {
        // get data from user
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and password required!"});
        }

        // if user exist
        const checkUser = await Users.findOne({email,password})
        if(!checkUser){
            return res.status(400).json({message: "User not exist!"});
        }

        //create authentication token
        const token = jwt.sign({user:{email, name: checkUser.name}}, process.env.JWT_SECRET, { expiresIn: '7d' } );

        //add user to database
        const addToken = await Users.updateOne({email},{ $push: { tokens: token } })

        //send success response
        res.status(200).json({message: "Login success",token, user: {name:checkUser.name,email:checkUser.email}});
    } catch (error) {

        res.status(500).json({message: "Something wrong",error});
    }
}