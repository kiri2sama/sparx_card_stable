#!/bin/bash

# Increase the inotify watchers limit temporarily
echo "Increasing inotify watchers limit temporarily..."
echo fs.inotify.max_user_watches=524288 | sudo tee -a /proc/sys/fs/inotify/max_user_watches

# Make the change permanent
echo "Making the change permanent..."
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

echo "File watchers limit increased to 524288"
echo "Current setting:"
cat /proc/sys/fs/inotify/max_user_watches