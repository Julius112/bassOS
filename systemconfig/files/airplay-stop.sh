#!/bin/sh
curl -H 'Content-Type: application/json' -X PUT -d '{"playback":"false"}' localhost:3000/services/airplay
