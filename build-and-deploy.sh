#!/bin/bash

SERVICE="solana-test-validator"

if pgrep -x "$SERVICE" >/dev/null
then
    echo "$SERVICE is running"

    echo "[CONFIGURING RPC URL to localhost]"
    solana config set --url localhost

    cd backend
    echo "[BUILDING]"
    cargo build-bpf > ../build-logs.txt

    echo "[DEPLOYING]"
    deploy_command=$(cat ../build-logs.txt | grep "solana program deploy" | sed 's/\$ //')
    eval $deploy_command | sed 's/Program Id: //' > ../program-id.txt

    echo "[PROGRAM DEPLOYED]"
    program_id=$(cat ../program-id.txt)

    echo "[LOGS STARTED FOR '$program_id']"
    solana logs $program_id

else
    echo "First start the '$SERVICE' service!"
fi