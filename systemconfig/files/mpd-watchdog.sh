#!/bin/bash
while : ; do
        mpc idle >> /dev/null
	if [[ $(mpc) == *paused* ]]
	then
		while [[ $(mpc) == *paused* ]] ; do
		        mpc idle >> /dev/null
		done
		#### Stop other audio sources ####
		sudo service shairport-sync restart &
		sudo service bt_speaker restart
		#echo stop
	fi
done
