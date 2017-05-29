#!/bin/sh
curl -H 'Content-Type: application/json' -X PUT -d '{"service":"airplay","playback":"true"}' localhost:3000/playback
