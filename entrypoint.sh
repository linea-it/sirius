#!/bin/sh
if [ $DEV = "true" ]; then
  yarn --pure-lockfile --ignore-optional
  yarn start
else
  yarn run serve -s build -l $PORT
fi
