#!/bin/sh
curl -H 'Content-Type: application/json' -X PUT -d '{"playback":true}' localhost:3000/services/bluetooth
