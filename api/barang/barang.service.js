const db = require("../../config/connection")

module.exports = {
    serviceAddBarang: (data, callBack)=>{
        db.query(
            `insert into item (item_name, price, stok, owner) values (?,?,?,?)`,
            [
                data.item_name,
                data.price,
                data.stok,
                data.owner
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

    serviceUpdateBarang: (data, callBack)=>{
        db.query(
            'UPDATE item SET item_name=?, price=?, stok=? WHERE id=? and owner=?',
            [
                data.item_name,
                data.price,
                data.stok,
                data.id,
                data.owner
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

    serviceDeleteBarang: (data, callBack)=>{
        db.query(
            'Delete from item WHERE id=? and owner=?',
            [
                data.id,
                data.owner
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

    serviceGetBarang: (data, callBack)=> {
        db.query(
            'select * from item where owner = ?',
            [data.owner],
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
