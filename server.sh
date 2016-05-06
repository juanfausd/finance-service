#!/usr/bin/env bash

./node_modules/nodus-server/bin/server.js helloworld $@ \
	| ./node_modules/bunyan/bin/bunyan
