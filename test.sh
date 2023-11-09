#!/bin/bash

echo "Start sending"

for (( i=0; i<1000; i++ ))
do
curl --header "Content-Type: application/json" \
    --request POST \
    --data  '{"amount": 2}' \
    localhost:3001/user/withdraw/1
echo "\n"
done
