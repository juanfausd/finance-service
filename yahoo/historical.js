const yahooFinance = require('yahoo-finance');

/**
 * Provides historical data about a specific symbol.
 *
 * @param symbol
 * @param from format yyyy-MM-dd
 * @param to format yyyy-MM-dd
 * @param period or granularity. Possible values: 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only).
 * @returns {*}
 */
module.exports = (symbol, from, to, period) => {

    if(!period) {
        period = 'd';
    }

    return yahooFinance.historical({
        symbol: symbol,
        from: from,
        to: to,
        period: period
    }, function (err, quotes) {

    });
}