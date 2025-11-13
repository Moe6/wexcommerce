#!/bin/bash

start_time=$(date +%s)
echo "Deploying lebobeautyco backend server..."

cd /opt/lebobeautyco/
git pull
chmod +x -R /opt/lebobeautyco/__scripts

/bin/bash /opt/lebobeautyco/__scripts/free-mem.sh

cd /opt/lebobeautyco/backend

npm install

sudo systemctl restart lebobeautyco
sudo systemctl status lebobeautyco --no-pager

/bin/bash /opt/lebobeautyco/__scripts/free-mem.sh

finish_time=$(date +%s)
elapsed_time=$((finish_time - start_time))
((sec=elapsed_time%60, elapsed_time/=60, min=elapsed_time%60, hrs=elapsed_time/60))
timestamp=$(printf "lebobeautyco API deployed in %d minutes and %d seconds." $min $sec)
echo $timestamp

#$SHEL
