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

# Run qmk setup on repo
echo "-> Downloading and setting up atude/qmk_firmware..."
cd $dir

# Run qmk setup on repo; switch to new home
qmk setup atude/qmk_firmware --yes
check_status "Failed to setup fresh qmk"

# Test a build to check setup works
echo "-> Running a test build to verify setup..."
cd "$dir/qmk_firmware"
qmk compile -kb cannonkeys/satisfaction75/rev1 -km via
check_status "Failed to run a test build successfully"

echo "-> Setup done!"
