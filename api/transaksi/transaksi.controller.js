const{
    serviceAddTransaksi,
    serviceCekStok,
    serviceUbahStok,
    serviceGetTransaksi,
    serviceCekTransaksi,
    serviceUpdateTransaksi,
    serviceDeleteTransaksi,
    serviceGetTransaksiBelumLunas,
    serviceGetTransaksiLunas
} = require("./transaksi.service")
const {
    checkToken
} = require("../../auth/token_validation")
const { verify } = require("jsonwebtoken")

module.exports = {
    controllerAddTransaksi: (req, res)=>{
        let body = req.body
        let token = req.get("authorization")
        if(token){
            token = token.slice(7)
            verify(token, "secretkey", (err, decoded)=>{
                if(err){
                    res.json({
                        success: 0,
                        message: "login first"
                    })
                }else{
                    var user = decoded.result1
                    const data_item = {
                        id_pembeli: user.id,
                        id_barang: body.id_barang,
                        jumlah: body.jumlah,
                        total: "0",
                        stok_now: "0"
                    }
                    serviceCekStok(data_item, (err, results)=>{
                        if(err){
                            console.log(err)
                            return res.json({
                                success: 0,
                                message: "not success"
                            })
                        }if(results[0].stok - data_item.jumlah >= 0){
                            if(user.firstName == results[0].owner){                                
                                res.json({
                                    success: 0,
                                    message: "anda penjualnya, mau ngapain ?"
                                })
                            }else{
                                data_item.total = results[0].price * body.jumlah
                                serviceAddTransaksi(data_item, (err, result2)=>{
                                    if(err){
                                        console.log(err)
                                        return res.json({
                                            success: 0,
                                            message: "not success transaksi"
                                        })
                                    }else{
                                        data_item.stok_now = results[0].stok - body.jumlah;
                                        serviceUbahStok(data_item, (err, results)=>{
                                            if(err){
                                                console.log(err)
                                                return res.json({
                                                    success: 0,
                                                    message: "pengurangan stok gagal"
                                                })
                                            }else{
                                                return res.json({
                                                    success: 1,
                                                    message: "succes transaksi",
                                                    data: result2
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        }else{
                            return res.json({
                                success: 1,
                                message: "Stok habis",
                            })
                        }
                    })
                    
                }
            })
        }
    },

    controllerGetTransaksi: function(req, res){
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
                    serviceGetTransaksi(data_item, function(err, result){
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

    controllerBayarTransaksi: (req, res)=>{
        let body = req.body
        let token = req.get("authorization")
        if(token){
            token = token.slice(7)
            verify(token, "secretkey", (err, decoded)=>{
                if(err){
                    res.json({
                        success: 0,
                        message: "login first"
                    })
                }else{
                    var user = decoded.result1
                    const data_item = {
                        id: body.id,
                        bayar: body.bayar,
                        id_pembeli: user.id
                    }
                    serviceCekTransaksi(data_item, function(err, result){
                        if(err){
                            console.log(err)
                            return
                        }
                        if(!result){
                            res.json({
                                success: 0,
                                message: "Transaksi tidak ditemukan"
                            })
                        }else{
                            if(result.total - body.bayar == 0){
                                const new_data = {
                                    id : body.id,
                                    id_pembeli: user.id,
                                    total: "0",
                                    status: "terbayar",
                                }
                                serviceUpdateTransaksi(new_data, function(err, result){
                                    if(err){
                                        console.log(err)
                                        return
                                    }else{
                                        return res.json({
                                            success: 1,
                                            message: "transaksi sudah terbayar lunas",
                                            data: result
                                          })
                                    }
                                })
                            }else{
                                let total = result.total - body.bayar;
                                const new_data = {
                                    id : body.id,
                                    id_pembeli: user.id,
                                    total: total,
                                    status: "belum dibayar",
                                }
                                serviceUpdateTransaksi(new_data, function(err, result){
                                    if(err){
                                        console.log(err)
                                        return
                                    }else{
                                        return res.json({
                                            success: 1,
                                            message: "transaksi sudah dicicil",
                                            data: result
                                          })
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    },

    controllerDeleteTransaksi: (req, res)=>{
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
                        id_pembeli: user.id
                    }
                    serviceCekTransaksi(data_item, function(err, result){
                        if(err){
                            console.log(err)
                            return
                        }
                        if(!result){
                            res.json({
                                success: 0,
                                message: "Transaksi tidak ditemukan"
                            })
                        }else{
                            const data_1 ={
                                id_barang: result.id_barang
                            }
                            serviceCekStok(data_1, (err, result1)=>{
                            if(err){
                                console.log(err)
                                return res.json({
                                    success: 0,
                                    message: "not success"
                                })
                            }else{
                                let stok = result1[0].stok + result.jumlah;
                                const new_stok ={
                                    stok_now: stok, 
                                    id_barang: result.id_barang
                                }
                                serviceUbahStok(new_stok, (err, result)=>{
                                    if(err){
                                        console.log(err)
                                        return res.json({
                                            success: 0,
                                            message: "perubahan stok gagal"
                                        })
                                    }else{
                                        serviceDeleteTransaksi(data_item, (err, results)=>{
                                            if(err){
                                                console.log(err)
                                                return res.json({
                                                    success: 0,
                                                    message: "not success delete transaksi"
                                                })
                                                }else if(results.affectedRows > 0){
                                                    return res.json({
                                                        success: 1,
                                                        message: "succes delete transaksi",
                                                        data: results
                                                    })
                                                }else{
                                                    return res.json({
                                                        success: 0,
                                                        message: "Bukan transaksi anda",
                                                    })
                                                }
                                            })
                                    }
                                })
                            
                            }
                        })
                    }
                    
                    })
                }
            })
        }
    },
    controllerGetTransaksiLunas: function(req, res){
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
                    serviceGetTransaksiLunas(data_item, function(err, result){
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
    controllerGetTransaksiBelumLunas: function(req, res){
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
                    serviceGetTransaksiBelumLunas(data_item, function(err, result){
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