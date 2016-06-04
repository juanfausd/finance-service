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
 * @returns {*}
 */
module.exports = (symbol) => {
    return Q.promise((resolve, reject) => {
        mongo_client.connect()
        .then(() => {
            return mongo_client.getRecentSnapshot(symbol, SOURCE)
            .then((snapshot) => {
                if(snapshot) {
                    return resolve(snapshot);
                }

                return yahoo_finance.snapshot({ symbol: symbol })
                .then((snapshot) => {
                    return mongo_client.insertSnapshot(snapshot, SOURCE);
                })
                .then((snapshot) => {
                    mongo_client.disconnect();
                    return resolve(snapshot);
                })
                .catch((err) => {
                    mongo_client.disconnect();
                    reject(err);
                });
            })
            .catch((err) => {
                reject(err);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}