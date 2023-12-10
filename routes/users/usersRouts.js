const express = require('express')
const { userRegister, userLogin, userProfile, userDelete, userProfileUpdate } = require('../../controller/users/userCtrlr')
const isLogin = require('../../middlewares/isLogin')


const usersRoute = express.Router()

usersRoute.post('/register', userRegister)
usersRoute.post('/login', userLogin)
usersRoute.get('/profile', isLogin, userProfile)
usersRoute.delete('/', isLogin, userDelete)
usersRoute.put('/profile', isLogin, userProfileUpdate)


module.exports = usersRoute;