const{
    serviceAddBarang,
    serviceUpdateBarang,
    serviceDeleteBarang,
    serviceGetBarang
} = require("./barang.service")
const {
    checkToken
} = require("../../auth/token_validation")
const { verify } = require("jsonwebtoken")

module.exports = {
    controllerAddItem: (req, res)=>{
        let body = req.body
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
                        item_name: body.item_name,
                        price: body.price,
                        stok: body.stok,
                        owner: user.firstName
                    }
                    serviceAddBarang(data_item, (err, results)=>{
                        if(err){
                            console.log(err)
                            return res.json({
                                success: 0,
                                message: "not success input item"
                            })
                        }else{
                            return res.json({
                                success: 1,
                                message: "succes input new item",
                                data: results
                            })
                        }
                    })
                }
            })
        }
    },

    controllerUpdateItem: (req, res)=>{
        let body = req.body
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
                        item_name: body.item_name,
                        price: body.price,
                        stok: body.stok,
                        id: body.id,
                        owner: user.firstName
                    }
                    serviceUpdateBarang(data_item, (err, results)=>{
                        if(err){
                            console.log(err)
                            return res.json({
                                success: 0,
                                message: "not success edit item"
                            })
                            }else if(results.affectedRows > 0){
                                return res.json({
                                    success: 1,
                                    message: "succes edit item",
                                    data: results
                                })
                            }else{
                                return res.json({
                                    success: 0,
                                    message: "Bukan barang anda",
                                })
                        }
                    })
                }
            })
        }
    },

    controllerDeleteItem: (req, res)=>{
        let body = req.body
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
                        id: body.id,
                        owner: user.firstName
                    }
                    serviceDeleteBarang(data_item, (err, results)=>{
                        if(err){
                            console.log(err)
                            return res.json({
                                success: 0,
                                message: "not success update item"
                            })
                            }else if(results.affectedRows > 0){
                                return res.json({
                                    success: 1,
                                    message: "succes input new item",
                                    data: results
                                })
                            }else{
                                return res.json({
                                    success: 0,
                                    message: "Bukan barang anda",
                                })
                        }
                    })
                }
            })
        }
    },

    controllerGetItem: function(req, res){
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
                        owner: user.firstName
                    }
                    serviceGetBarang(data_item, function(err, result){
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
                }
            })
        }
    },

}