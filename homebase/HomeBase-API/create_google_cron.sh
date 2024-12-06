#!/bin/bash

# Run create channels command (should be run every night)
(crontab -l; echo "0 6 * * * php $PWD/bin/console app:create-channels > $PWD/last_cron_result.txt") | sort - | uniq - | crontab -;
echo "Cron job created";