#!/bin/bash
# Run mongod server and mongo client

DBPATH=./data/

if [ ! -d $DBPATH ]; then
  # check if data path exists, if not, run the following command
  echo "Initialising data directory..."
  mkdir data
fi

mongod --dbpath $DBPATH --smallfiles