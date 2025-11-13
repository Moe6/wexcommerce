#!/bin/bash

start_time=$(date +%s)
echo "Deploying lebobeautyco frontend..."

cd /opt/lebobeautyco/
git pull
sudo chmod +x -R /opt/lebobeautyco/__scripts

/bin/bash /opt/lebobeautyco/__scripts/free-mem.sh

cd /opt/lebobeautyco/frontend
npm install --force
sudo rm -rf .next
npm run build

sudo systemctl restart lebobeautyco-frontend
sudo systemctl status lebobeautyco-frontend --no-pager

/bin/bash /opt/lebobeautyco/__scripts/free-mem.sh

#sudo rm -rf /var/cache/nginx
#sudo systemctl restart nginx
#sudo systemctl status nginx --no-pager

finish_time=$(date +%s)
elapsed_time=$((finish_time - start_time))
((sec=elapsed_time%60, elapsed_time/=60, min=elapsed_time%60, hrs=elapsed_time/60))
timestamp=$(printf "lebobeautyco frontend deployed in %d minutes and %d seconds." $min $sec)
echo $timestamp

#$SHELL
