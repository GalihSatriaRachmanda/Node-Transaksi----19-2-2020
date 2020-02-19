const db = require("../../config/connection")

module.exports = {
    serviceCekStok: (data, callBack)=>{
        db.query(
            'select stok, price, owner from item where id=?',
            [
                data.id_barang
             ],
            (err, result, fields)=>{
                if(err){
                    return callBack(err)
                }else{
                    return callBack(null, result)
                }

            }
        )
    },

    serviceAddTransaksi: (data, callBack)=>{
        db.query(
            `insert into transaksi (id_pembeli, id_barang, jumlah, total) values (?,?,?,?)`,
            [
                data.id_pembeli,
                data.id_barang,
                data.jumlah,
                data.total,
             ],
            (err, result, fields)=>{
                if(err){
                    return callBack(err)
                }else{
                    return callBack(null, result)
                }

            }
        )
    },

    serviceUbahStok: (data, callBack)=>{
        db.query(
            'UPDATE item SET stok=? WHERE id=?',
            [
                data.stok_now,
                data.id_barang,
            ],
            (err, result, fields)=>{
                if(err){
                    return callBack(err)
                }else{
                    return callBack(null, result)
                }

            }
        )
    },

    serviceGetTransaksi: (data, callBack)=> {
        db.query(
            'select * from transaksi where id_pembeli = ?',
            [data.id],
            (err, results, field) => {
                if (err) {
                    return callBack(err)
                } else {
                    return callBack(null, results)
                }
            }
        )   
    },

    serviceCekTransaksi: (data, callBack)=> {
        db.query(
            'select * from transaksi where id =? and id_pembeli =?',
            [
                data.id,
                data.id_pembeli
            ],
            (err, results, field) => {
                if (err) {
                    return callBack(err)
                } else {
                    return callBack(null, results[0])
                }
            }
        )   
    },

    serviceUpdateTransaksi: (data, callBack)=> {
        db.query(
            'update transaksi set total=? , status=? where id =? and id_pembeli =?',
            [
                data.total,
                data.status,
                data.id,
                data.id_pembeli
            ],
            (err, results, field) => {
                if (err) {
                    return callBack(err)
                } else {
                    return callBack(null, results)
                }
            }
        )   
    },
    serviceDeleteTransaksi: (data, callBack)=>{
        db.query(
            'Delete from transaksi WHERE id=? and id_pembeli=?',
            [
                data.id,
                data.id_pembeli
            ],
            (err, result, fields)=>{
                if(err){
                    return callBack(err)
                }else{
                    return callBack(null, result)
                }

            }
        )
    },
    serviceGetTransaksiLunas: (data, callBack)=> {
        db.query(
            'select * from transaksi where id_pembeli = ? and status = "terbayar"',
            [data.id],
            (err, results, field) => {
                if (err) {
                    return callBack(err)
                } else {
                    return callBack(null, results)
                }
            }
        )   
    },
    serviceGetTransaksiBelumLunas: (data, callBack)=> {
        db.query(
            'select * from transaksi where id_pembeli = ? and status = "belum dibayar"',
            [data.id],
            (err, results, field) => {
                if (err) {
                    return callBack(err)
                } else {
                    return callBack(null, results)
                }
            }
        )   
    },
}