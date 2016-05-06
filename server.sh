#!/usr/bin/env node 

./node_modules/nodus-server/bin/server.js index.js $@ \
	| ./node_modules/bunyan/bin/bunyan
