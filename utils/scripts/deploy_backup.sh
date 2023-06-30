#/bin/bash

SARP_BCK_NAME=SARP-`date +%Y%m%d`.tgz
NGINX_BCK_NAME=NGINX-`date +%Y%m%d`.tgz

tar cvzf  /tmp/$SARP_BCK_NAME --exclude="node_modules" ~/SARP
rclone copy /tmp/$SARP_BCK_NAME backup:SARP_DEPLOY_BACKUP
rm /tmp/$BCK_NAME

tar cvzf /tmp/$NGINX_BCK_NAME /nginx/
rclone copy /tmp/$NGINX_BCK_NAME backup:SARP_DEPLOY_BACKUP
rm /tmp/$NGINX_BCK_NAME

