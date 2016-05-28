// ** Dependencies
const schedule_snapshots = require('./schedule/schedule_snapshots');

// ** Scheduling
schedule_snapshots();

module.exports = require('./server.json');