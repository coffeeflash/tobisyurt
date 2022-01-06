#!/bin/bash

JEKYLL_ENV=production bundle exec jekyll build
rsync -avr --rsh='ssh' --delete-after --delete-excluded _site/ rsync -avr --rsh='ssh' --delete-after --delete-excluded _site/ root@10.0.0.5:/mnt/sysdataset/iocage/jails/blog/root/usr/local/www/blog
