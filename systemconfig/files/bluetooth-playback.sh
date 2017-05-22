#!/bin/sh
curl -H 'Content-Type: application/json' -X PUT -d '{"service":"bluetooth"}' localhost:3000/playback
