// ** Dependencies
const CronJob = require('cron').CronJob;
const mongo_client = require('../db/mongo-client');
const Q = require('q');
const yahoo_finance = require('yahoo-finance');

// ** Constants
const SOURCE = 'yahoo';

module.exports = () => {
    const freq = '0,5,10,15,20,25,30,35,40,45,50,55 * * * * *';
    new CronJob(freq, function(){
        return Q.promise((resolve, reject) => {
            mongo_client.connect()
            .then((db) => {
                mongo_client.getOldestDailySnapshot(db, SOURCE)
                .then((db_snapshot) => {
                    if(!db_snapshot) {
                        return;
                    }
                    
                    return yahoo_finance.snapshot({ symbol: db_snapshot.symbol })
                    .then((snapshot) => {
                        return mongo_client.insertSnapshotIfNotExists(db, snapshot, SOURCE);
                    })
                    .then((snapshot) => {
                        mongo_client.disconnect(db);
                        console.log('Executed scheduled task to retrieve snapshots from: ' + db_snapshot.symbol + ".");
                        return resolve(snapshot);
                    })
                    .catch((err) => {
                        console.log(err);
                        mongo_client.disconnect(db);
                        reject(err);
                    });
                });
            })
            .catch((err) => {
                console.log('An error occurred while executing scheduled task to retrieve snapshots.');
                reject(err);
            });
        });
    }, null, true, "America/Los_Angeles");
};
