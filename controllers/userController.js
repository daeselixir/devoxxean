const User = require('../models/user')
const catchAsync = require('../helpers/catchAsync')

exports.getAllUsers =  catchAsync( async (req, res,next) => {
    const users = await User.find()
    
    //Send response
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})