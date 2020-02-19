const db = require("../../config/connection")

module.exports = {
    serviceAddUser: (data, callBack)=>{
        db.query(
            'insert into registration (firstname, lastname, gender, email, password, number) values (?,?,?,?,?,?)',
             [
                data.first_name,
                data.last_name,
                data.gender,
                data.email,
                data.password,
                data.number
             ],
             (error, result, fields) =>{
                 if(error) {
                     return callBack(error);
                 } else {
                     return callBack(null, result)
                 }
             }   
        )
    },
    serviceGetUsers: callBack => {
        db.query(
            'select * from registration',
            [],
            (err, result, fields) => {
                if (err) {
                    return callBack(err)
                } else {
                    return callBack(null, result)
                }
            }
        )
    },
    serviceGetUserById: (data, callBack)=> {
        db.query(
            'select * from registration where id = ?',
            [data.id],
            (err, results, field) => {
                if (err) {
                    return callBack(err)
                } else {
                    return callBack(null, results[0])
                }
            }
        )   
    },
    serviceUpdateUser: (data, callBack) =>{
        db.query(
            'UPDATE registration SET firstname=?, lastname=?, gender=?, email=?, password=?, number=? WHERE id=?',
            [
                data.first_name,
                data.last_name,
                data.gender,
                data.email,
                data.password,
                data.number,
                data.id
            ],
            (err, result, fields) =>{
                if (err) {
                    return callBack(err);
                } else {
                    return callBack(null, result)
                }
            }   
        )
    },
    serviceDeleteUser: (data, callBack)=>{
        db.query(
            'delete from registration where id=?'
            [data.id],
            (err, results, fields)=>{
                if (err) {
                    callBack(err)
                } 
                if(!result){
                    callBack(results)
                }else{
                    db.query(
                        
                    )
                    
                }
            }
        )
    },
    serviceGetUserByEmail: (email, callBack) =>{
        db.query(
            'select firstName, email, password, id from registration where email = ?',
            [email],
            (err, results, fields) => {
                if (err) {
                    return callBack(err)
                } else {
                    return callBack(null, results[0])
                }
            }
        )
    }
}
