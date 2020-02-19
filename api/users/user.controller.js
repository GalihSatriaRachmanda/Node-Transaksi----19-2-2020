const {
    serviceAddUser,
    serviceGetUsers,
    serviceGetUserById,
    serviceUpdateUser,
    serviceDeleteUser,
    serviceGetUserByEmail
} = require("./user.service")

const { genSaltSync, hashSync, compareSync} = require("bcrypt")
const { sign } = require("jsonwebtoken")
const { verify } = require("jsonwebtoken")

module.exports = {
    controllerAddUser: function(req, res){
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        serviceAddUser(body, function(err, result){
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                })
            }
            return res.status(200).json({
                success: 1,
                data: result
            })
        })
    },
    controllerGetUserById: function(req, res){
        let token = req.get("authorization")
        if(token){
            token = token.slice(7)
            verify(token, "secretkey", (err, decoded)=>{
                if(err){
                    res.json({
                        success: 0,
                        message: "login firts"
                    })
                }else{
                    var user = decoded.result1
                    const data_item = {
                        id: user.id,
                    }
                    serviceGetUserById(data_item, function(err, result){
                        if(err){
                            console.log(err)
                            return
                        }
                        if(!result){
                            return res.json({
                            success: 0,
                            message: "record not found"
                        })
                        }else{
                            return res.json({
                                success: 1,
                                data: result
                            })
                        }
                    })
                }
            })
        }
    },
    controllerGetUsers: function(req, res){
        serviceGetUsers(function(err, result){
            if(err){
                console.log(err)
                return
            }else{
                return res.json({
                    success: 1,
                    data: result
                })
            }
        })
    },
    controllerUpdateUser: function(req, res){
        const body = req.body
        const salt = genSaltSync(10)
        body.password = hashSync(body.password, salt)
        let token = req.get("authorization")
        if(token){
            token = token.slice(7)
            verify(token, "secretkey", (err, decoded)=>{
                if(err){
                    res.json({
                        success: 0,
                        message: "login firts"
                    })
                }else{
                    var user = decoded.result1
                    const data_item = {
                        id: user.id,
                        first_name: body.first_name,
                        last_name: body.last_name,
                        gender: body.gender,
                        email: body.email,
                        password: body.password,
                        number: body.number
                    }
                    serviceUpdateUser(data_item, function(err, result){
                        if(err){
                            console.log(err)
                            return
                        }
                        if(!result){
                            return res.json({
                                success: 0,
                                message: "Update failed"
                            })
                        }else{
                            return res.json({
                                success: 1,
                                message: "Update was successfull"
                            })
                        }
                    })
                }
            })
        }
    },
    controllerDeleteUser: function(req, res){
        let token = req.get("authorization")
        if(token){
            token = token.slice(7)
            verify(token, "secretkey", (err, decoded)=>{
                if(err){
                    res.json({
                        success: 0,
                        message: "login firts"
                    })
                }else{
                    var user = decoded.result1
                    const data_item = {
                        id: user.id,
                    }
                    serviceDeleteUser(data_item, function(err, result){
                        if(err){
                            console.log(err)
                            return
                        }
                        if(!result){
                            return res.json({
                                success: 0,
                                message: "Record not found"
                            })
                        }else{
                            return res.json({
                                success: 1,
                                message: "Delete was successfull"
                            })
                        }
                    })
                }
            })
        }
    },
    controllerLogin: function(req, res){
        const body = req.body
        serviceGetUserByEmail(body.email, function(err, result){
            if(err){
                console.log(err)
                return
            }
            if(!result){
                return res.json({
                    success: 0,
                    message: "Invalid email or password"
                })
            }
            const result1 = compareSync(body.password, result.password)
            if(result1){
                result.password = undefined
                const token = sign({result1:result}, "secretkey", {
                    expiresIn: "1h"
                })
                return res.json({
                    success: 1,
                    message: "Login successfull",
                    account: result,
                    token: token
                })
            }
        })
    }
}