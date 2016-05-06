const yahooFinance = require('yahoo-finance');

/**
 * Provides a snapshot for a specific symbol.
 *
 * @param symbol
 * @returns {*}
 */
module.exports = (symbol) => {

    return yahooFinance.snapshot({
        symbol: symbol
    }, function (err, snapshot) {

    });
}