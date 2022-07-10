#! /bin/bash

#TODO: this needs to be dynamic

# Set to new home, flash, and then set back to existing home directory
qmk config user.qmk_home=/Users/atude/Core/projects/qmk_atude
qmk flash -kb cannonkeys/satisfaction75/rev1 -km via
qmk config user.qmk_home=OLD_HOME
