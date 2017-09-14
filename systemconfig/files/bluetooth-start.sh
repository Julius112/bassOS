#!/bin/sh
curl -H 'Content-Type: application/json' -X PUT -d '{"service":"bluetooth","playback":"true"}' localhost:3000/playback
