#!/bin/bash
if [ -f /var/run/bluetooth_pair.pid ]; then
    kill -9 `cat /var/run/bluetooth_pair.pid`
    rm /var/run/bluetooth_pair.pid
fi
