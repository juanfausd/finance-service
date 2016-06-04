// ** Dependencies
const Q = require('q');
const mongo_client = require('../db/mongo-client');

// ** Constants
const SOURCE = 'yahoo';

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
        .then(() => {
            return mongo_client.getDailySnapshots(symbol, SOURCE, date)
            .then((snapshots) => {
                mongo_client.disconnect();
                return resolve(snapshots);
            })
            .catch((err) => {
                mongo_client.disconnect();
                reject(err);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}