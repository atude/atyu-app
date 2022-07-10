#! /bin/bash

# Check if git and qmk are installed
which qmk 
which git
# TODO: error if not found

# Clone atude/qmk_firmware 
# TODO:

# Run qmk setup on repo
qmk setup atude/qmk_firmware

# Get existing home config, change it, and set it back after flashing
# Change home config
# TODO: 
qmk config user.qmk_home=/Users/atude/Core/projects/qmk_atude