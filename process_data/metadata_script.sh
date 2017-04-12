#!/usr/bin/env bash

SOURCE_DIR=/big/livejournal/data/events
OUT_DIR=/home/franky/metadata

for folder in $SOURCE_DIR/*; do
    folderbase=$(basename $folder)
    fname="meta_$folderbase.csv"
    if [[ -e $OUT_DIR/$fname ]]; then
        continue
    fi
    echo $folder
    python2 parse_metadata.py $folder $OUT_DIR
done
