// ** Dependencies
const CronJob = require('cron').CronJob;
const mongo_client = require('../db/mongo-client');
const Q = require('q');
const yahoo_finance = require('yahoo-finance');

// ** Constants
const SOURCE = 'yahoo';

module.exports = () => {
    const freq = '0,5,10,15,20,25,30,35,40,45,50,55 * * * * *';

    var i = -1;
    new CronJob(freq, function(){
        return Q.promise((resolve, reject) => {
            mongo_client.connect()
            .then(() => {
                return mongo_client.getSymbols(SOURCE)
                .then((symbols) => {
                    i++;

                    if(i >= symbols.length) {
                        i = 0;
                    }

                    if(!symbols[i]) {
                        console.log('No more symbols to fetch.');
                        resolve(null)
                    }

                    return yahoo_finance.snapshot({ symbol: symbols[i].symbol })
                    .then((snapshot) => {
                        return mongo_client.insertSnapshotIfNotExists(snapshot, SOURCE);
                    })
                    .then((snapshot) => {
                        console.log('Executed scheduled task to retrieve snapshots from: ' + symbols[i].symbol + '.');
                        //mongo_client.disconnect();
                        return resolve(snapshot);
                    })
                    .catch((err) => {
                        console.log(err);
                        mongo_client.disconnect();
                        reject(err);
                    });
                })
                .catch((err) => {
                    console.log('An error occurred while executing scheduled task to retrieve snapshots.');
                    console.log(err);
                    mongo_client.disconnect();
                    reject(err);
                });
            });
        });
    }, null, true, "America/Los_Angeles");
};
