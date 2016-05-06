#!/usr/bin/env bash

./node_modules/nodus-run/run.js $@ \
	| ./node_modules/bunyan/bin/bunyan
