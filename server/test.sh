#!/bin/bash

source ./environ_emulator.sh
pytest --cov=app  --cov-branch --cov-fail-under=80 "$@"

exit $?