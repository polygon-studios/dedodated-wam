/**
 * mySQL.js
 * ----------------------------------
 * Handles database requests functions
 * @router
 */


var express   = require('express'),
    http      = require('http');
var router    = express.Router();
var server    = express.Server;
var mysql     =    require('mysql');


var pool      =    mysql.createPool({
    connectionLimit : 1000, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'address_book',
    debug    :  true
});

function handle_database(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from user",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
}
