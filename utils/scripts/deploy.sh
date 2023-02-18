#!/bin/bash

# simple script to prepare the SARP_PRODUCTION DIRECTORY

BUILD_DIR=SARP_BUILD
PRODUCTION_DIR=SARP_DEPLOY

#build SARP
echo "BUILDING SARP........."
npm run build

if [ $? != 0 ]; then
    echo "####################################"
    echo "SARP BUILD FAILED!!!!!";
    echo "####################################"
    exit 1
fi

echo "####################################"
echo "SARP BUILD SUCCESS!!!!!"
echo "####################################"

#prepara SARP_PRODUCTION directory
#deve essere copiata in produzione
rm -f $PRODUCTION_DIR*.tgz
rm -rf $PRODUCTION_DIR
mkdir -p $PRODUCTION_DIR
mkdir -p $PRODUCTION_DIR/prisma
cp -Rv $BUILD_DIR/* $PRODUCTION_DIR
cp .env $PRODUCTION_DIR
cp package.json package-lock.json $PRODUCTION_DIR
cp -Rv prisma/migrations $PRODUCTION_DIR/prisma
cp prisma/schema.prisma $PRODUCTION_DIR/prisma 
cp -Rv utils/ $PRODUCTION_DIR
cp -Rv server_static/ $PRODUCTION_DIR

tar cvzf $PRODUCTION_DIR\_`date +%Y-%m-%dT%H-%M-%S`.tgz $PRODUCTION_DIR