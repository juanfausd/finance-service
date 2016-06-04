// ** Dependencies
const MongoClient = require('mongodb').MongoClient;
const Q = require('q');

// ** Config
const url = 'mongodb://localhost:27017/finance';

var connection = null;

function connect() {
    return Q.Promise((resolve, reject) => {
        if(connection) {
            return resolve(connection);
        }

        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
                return reject(err);
            }

            connection = db;

            return resolve(db);
        });
    });
}

function getConnection() {
    return connection;
}

function disconnect() {
    connection.close();
    connection = null;
}

module.exports = {
    connect: connect,
    disconnect: disconnect,
    getConnection: getConnection
};
