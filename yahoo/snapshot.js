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
    var minDate = new Date();
    minDate.setHours(11);
    minDate.setMinutes(0);
    var maxDate = new Date();
    maxDate.setHours(17);
    maxDate.setMinutes(15);
    const actualDate = new Date();

    return snapshot.length > 0 && snapshot.timestamp > tolerance || (actualDate < minDate || actualDate > maxDate);
}

/**
 * Provides a snapshot for a specific symbol.
 *
 * @param symbol
 * @returns {*}
 */
module.exports = (symbol) => {
    return Q.promise((resolve, reject) => {
        mongo_client.connect()
        .then((db) => {
            mongo_client.getRecentSnapshot(db, symbol, SOURCE)
            .then((snapshot) => {
                if(isRecentSnapshot(snapshot)) {
                    mongo_client.disconnect(db);
                    return resolve(snapshot);
                }

                return yahoo_finance.snapshot({ symbol: symbol })
                .then((snapshot) => {
                    return mongo_client.insertSnapshot(db, snapshot, SOURCE);
                })
                .then((snapshot) => {
                    mongo_client.disconnect(db);
                    return resolve(snapshot);
                })
                .catch((err) => {
                    reject(err);
                });
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}