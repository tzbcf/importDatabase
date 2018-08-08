const mysql      = require('mysql');
var moment = require('moment');
const ehzos = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'ehzos'
});
 
exports.queryEhzos = ( sql, values ) => {
    return new Promise(( resolve, reject ) => {
        ehzos.getConnection( (err, connection) => {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {
                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    connection.release()
                })
            }
        })
    })

};

let ehz = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'ehz0726'
  });
  exports.queryEhz = ( sql, values ) => {
    return new Promise(( resolve, reject ) => {
        ehz.getConnection( (err, connection) => {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {
                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    connection.release()
                })
            }
        })
    })

};

exports.standardCurrDatetime = function () {
    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
};

