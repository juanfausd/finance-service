// ** Dependencies
const CronJob = require('cron').CronJob;
const mongo_client = require('../db/mongo-client');
const Q = require('q');
const yahoo_finance = require('yahoo-finance');

// ** Constants
const SOURCE = 'yahoo';

function getSymbols() {
    mongo_client.connect()
    .then((db) => {
        return mongo_client.getSymbols(db, SOURCE)
        .then((symbols) => {
            console.log(symbols);
            mongo_client.disconnect(db);
            return symbols;
        });
    });
}

module.exports = () => {
    const freq = '0,5,10,15,20,25,30,35,40,45,50,55 * * * * *';

    var i = -1;
    new CronJob(freq, function(){
        return Q.promise((resolve, reject) => {
            mongo_client.connect()
            .then((db) => {
                return mongo_client.getSymbols(db, SOURCE)
                .then((symbols) => {
                    i++;
                    
                    if(i == symbols.length) {
                        i = 0;
                    }

                    console.log(symbols[i].symbol);
                    return yahoo_finance.snapshot({ symbol: symbols[i].symbol })
                    .then((snapshot) => {
                        return mongo_client.insertSnapshotIfNotExists(db, snapshot, SOURCE);
                    })
                    .then((snapshot) => {
                        mongo_client.disconnect(db);
                        console.log('Executed scheduled task to retrieve snapshots from: ' + symbols[i].symbol + '.');
                        return resolve(snapshot);
                    })
                    .catch((err) => {
                        console.log(err);
                        mongo_client.disconnect(db);
                        reject(err);
                    });
                })
                .catch((err) => {
                    console.log('An error occurred while executing scheduled task to retrieve snapshots.');
                    reject(err);
                });
            });
        });
    }, null, true, "America/Los_Angeles");
};
