#!/bin/bash

echo "starting builds: " ; date

echo "push mode: $2"

cd ../mon-projet

commit_hash=$(git log -1 --format=format:"%H")

echo hash:"$commit_hash"

echo "building Front_with_a_Vue image tag: $commit_hash and latest$1"

./docker_images_builder_cross_build.sh "$3" "$commit_hash" "$2"

EXIT_BUILD=$?
if [ $EXIT_BUILD -eq 0 ]
then
    echo "building Front_with_a_Vue image tag: $commit_hash  OK"
else
     echo "building Front_with_a_Vue image tag: $commit_hash ERROR"
     exit $EXIT_BUILD
fi

./docker_images_builder_cross_build.sh "$3" latest"$1" "$2"

EXIT_BUILD=$?
if [ $EXIT_BUILD -eq 0 ]
then
    echo "building Front_with_a_Vue image tag: latest$1 OK"
else
     echo "building Front_with_a_Vue image tag: latest$1 ERROR"
     exit $EXIT_BUILD
fi

echo "end of all builds"; date
exit 0
