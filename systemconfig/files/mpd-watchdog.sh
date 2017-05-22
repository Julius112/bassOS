#!/bin/bash
while : ; do
        mpc idle >> /dev/null
	if [[ $(mpc) == *paused* ]]
	then
		while [[ $(mpc) == *paused* ]] ; do
		        mpc idle >> /dev/null
		done
		curl -H 'Content-Type: application/json' -X PUT -d '{"service":"mpd"}' localhost:3000/playback
		#echo stop
	fi
done
