#!/bin/sh
curl -H 'Content-Type: application/json' -X PUT -d '{"service":"airplay","playback":"false"}' localhost:3000/playback
