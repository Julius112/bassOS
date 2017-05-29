#!/bin/sh
curl -H 'Content-Type: application/json' -X PUT -d '{"service":"bluetooth","playback":"false"}' localhost:3000/playback
