// ** Dependencies
const MongoClient = require('mongodb').MongoClient;
const Q = require('q');

// ** Config
const url = 'mongodb://localhost:27017/finance';

function connect() {
    return Q.Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
                return reject(err);
            }

            return resolve(db);
        });
    });
}

function disconnect(db) {
    db.close();
}

function getRecentSnapshot(db, symbol, source) {
    return Q.Promise((resolve, reject) => {
        db.collection('snapshots').find({ symbol: symbol, source: source }).limit(1).sort({ 'timestamp' : 1 }).toArray(function(err, items) {
            if(err) {
                return reject(err);
            }

            return resolve(items[0]);
        });
    });
}

function getSymbols(db, source) {
    return Q.Promise((resolve, reject) => {
        var start = new Date();
        start.setHours(0,0,0,0);
        var end = new Date();
        end.setHours(23,59,59,999);

        db.collection('snapshots').find({ source: source }, { symbol: 1 }).sort({ 'timestamp' : 1 }).toArray(function(err, items) {
            if(err) {
                return reject(err);
            }

            return resolve(items);
        });
    });
}

function getDailySnapshots(db, symbol, source, date) {
    var start = new Date(date.getTime());
    start.setHours(0,0,0,0);
    var end = new Date(date.getTime());
    end.setHours(23,59,59,999);

    return Q.Promise((resolve, reject) => {
        db.collection('snapshots').find({ symbol: symbol, source: source, timestamp: {$gte: start, $lt: end} }).sort({ 'timestamp' : 1 }).toArray(function(err, items) {
            if(err) {
                return reject(err);
            }

            return resolve(items);
        });
    });
}

function insertSnapshot(db, snapshot, source) {
    snapshot.timestamp = new Date();
    snapshot.source = source;

    return Q.Promise((resolve, reject) => {
        return db.collection('snapshots').insertOne(snapshot, function (err, item) {
            if(err) {
                console.log(err);
                return reject(err);
            }
            console.log('Inserted snapshot. Symbol: ' + snapshot.symbol);
            return resolve(snapshot);
        });
    });
}

function updateSnapshot(db, snapshot) {
    return Q.Promise((resolve, reject) => {
        return db.collection('snapshots').updateOne({ _id: snapshot._id }, { $set: { timestamp: snapshot.timestamp } }, function (err, item) {
            if(err) {
                console.log(err);
                return reject(err);
            }
            console.log('Updated snapshot. Symbol: ' + snapshot.symbol);
            return resolve(snapshot);
        });
    });
}

function insertSnapshotIfNotExists(db, snapshot, source) {
    snapshot.timestamp = new Date();
    snapshot.source = source;
    const query = {
        source: snapshot.source,
        symbol: snapshot.symbol,
        lastTradeDate: snapshot.lastTradeDate,
        lastTradeTime: snapshot.lastTradeTime
    };

    return Q.Promise((resolve, reject) => {
        db.collection('snapshots').find(query).limit(1).toArray(function(err, items) {
            if(err) {
                console.log(err);
                return reject(err);
            }

            if(items.length > 0) {
                items[0].timestamp = new Date();
                return updateSnapshot(db, items[0]).then((item) => {
                    resolve(item);
                });
            }
            else {
                return insertSnapshot(db, snapshot, source).then((item) => {
                    resolve(item);
                });
            }
        });
    });
}

module.exports = {
    connect: connect,
    disconnect: disconnect,
    getRecentSnapshot: getRecentSnapshot,
    getSymbols: getSymbols,
    getDailySnapshots: getDailySnapshots,
    insertSnapshot: insertSnapshot,
    updateSnapshot: updateSnapshot,
    insertSnapshotIfNotExists: insertSnapshotIfNotExists
};
