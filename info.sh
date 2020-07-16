#!/usr/bin/env bash
set -e

USER=$1
DEVICE="/dev/nvme0n1"

BOOT_MODE=""
CPU_VENDOR=""

# Firmware type
if [ -d /sys/firmware/efi ]; then
    BOOT_MODE="uefi"
else
    BOOT_MODE="bios"
fi

# CPU vendor
if [ -n "$(lscpu | grep GenuineIntel)" ]; then
    CPU_VENDOR="intel"
elif [ -n "$(lscpu | grep AuthenticAMD)" ]; then
    CPU_VENDOR="amd"
fi

# Drive type
DRIVE_TYPE=""
if [ -n "$(echo $DEVICE | grep "^/dev/[a-z]d[a-z]")" ]; then
    DEVICE="sata"
elif [ -n "$(echo $DEVICE | grep "^/dev/nvme")" ]; then
    DEVICE="nvme"
elif [ -n "$(echo $DEVICE | grep "^/dev/mmc")" ]; then
    DEVICE="mmc"
fi

function save_settings() {
    PROJECT="arch-linux-installation"
    COLLECTION="https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/users"

    OUTPUT_LSBLK="$(lsblk --json --output-all)"
    OUTPUT_LSEFI="$(ls /sys/firmware/efi/efivars)"
    OUTPUT_LSCPU="$(lscpu | grep Vendor)"

    curl -X PATCH -H "Content-Type: application/json" \
        -d "{'fields':{
                'bootMode':{'stringValue':'${BOOT_MODE}'},
                'processor':{'stringValue':'${CPU_VENDOR}'},
                'lsblk':{'stringValue':'${OUTPUT_LSBLK}'},
                'lsefi':{'stringValue':'${OUTPUT_LSEFI}'},
                'lscpu':{'stringValue':'${OUTPUT_LSCPU}'},
                'time':{'stringValue':'$(date +%s)'}
            }}" \
        ${COLLECTION}/${USER}/
}

save_settings