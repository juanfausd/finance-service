# Finance Service
This project consists on a small service that provides financial data. For now it has Yahoo as it's source, but the idea is to include more sources in a future.

# Setup
After downloading the code for this repository, and installing NodeJS 5.

`npm install`

This will download the dependencies to get the finance service working.

# Running the Server
The `nodus-server` package is used to host the finance service. So, if you have `nodus-server` installed as a global package, you can simply run the following command in the terminal:

`nodus-server index.js`

If you don't have `nodus-server` installed globally, you can use the `server.sh` script, by simply running in the terminal the following command:

`./server.sh`

Or

`bash server.sh`
