// ** Dependencies
const yahoo_finance = require('yahoo-finance');
const Q = require('q');
const mongo_client = require('../db/mongo-client');

// ** Constants
const REFRESH_INTERVAL_MINUTES = 30;
const SOURCE = 'yahoo';

function isRecentSnapshot(snapshot) {
    if(!snapshot) {
        return false;
    }

    const tolerance = new Date((new Date()).getTime() - REFRESH_INTERVAL_MINUTES * 60000);

    return snapshot.timestamp > tolerance;
}

/**
 * Provides a snapshot for a specific symbol.
 *
 * @param symbol
 * @param date
 * @returns {*}
 */
module.exports = (symbol, date) => {
    date = date ? new Date(date) : new Date();

    return Q.promise((resolve, reject) => {
        mongo_client.connect()
        .then((db) => {
            return mongo_client.getDailySnapshots(db, symbol, SOURCE, date)
            .then((snapshots) => {
                mongo_client.disconnect(db);
                return resolve(snapshots);
            })
            .catch((err) => {
                mongo_client.disconnect(db);
                reject(err);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}