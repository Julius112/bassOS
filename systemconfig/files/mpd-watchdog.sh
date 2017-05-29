#!/bin/bash
paused=false
if [[ $(mpc) == *paused* ]]
then
	paused="true"
else
	paused="false"
fi
while : ; do
        mpc idle >> /dev/null
		while [[ ( ( $(mpc) == *paused* ) && ( $paused == "true" ) ) || ( ( $(mpc) == *playing* ) && ( $paused == "false" ) ) ]] ; do
		        mpc idle >> /dev/null
		done
		if [[ $(mpc) == *paused* ]]
		then
			paused="true"
		else
			paused="false"
		fi
		curl -H 'Content-Type: application/json' -X PUT -d '{"service":"mpd"}' localhost:3000/playback
		echo $paused
done
