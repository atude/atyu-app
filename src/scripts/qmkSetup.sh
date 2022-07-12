#!/bin/bash

dir="/Users/atude/Core/projects/qmk_atude"

check_status() {
	status=$? 
	[ $status -ne 0 ] && echo "-> script_error: $1" && exit 1
}

# Check if git and qmk are installed
echo "-> Checking if qmk and git are installed..."
checkQmk="which qmk"
checkGit="which git"
$checkQmk && $checkGit
check_status "Could not find git or qmk"

# Setup qmk and set qmk home
echo "-> Downloading and setting up atude/qmk_firmware..."
cd $dir

# Run qmk setup on repo
qmk setup atude/qmk_firmware --home "$dir/qmk_firmware" --yes
check_status "Failed to setup fresh qmk"
