#/bin/bash

sqlite3 /home/sarp/SARP/prisma/SARP.db '.backup /tmp/SARP-BACKUP.db'
mv /tmp/SARP-BACKUP.db /tmp/SARP-`date +%Y%m%d`.db
rclone copy /tmp/SARP-20* backup:SARP_DB_BACKUP
rm /tmp/SARP-20*
curl https://nosnch.in/436ea07b4f


