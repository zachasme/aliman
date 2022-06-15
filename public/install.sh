#!/usr/bin/env bash
set -e

USER=$1
PROJECT="arch-linux-installation"
COLLECTION="https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/users"

PROJECT="arch-linux-installation"
COLLECTION="https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/users"

OUTPUT_LSBLK="$(lsblk --json --output-all)"
OUTPUT_LSEFI="$(ls /sys/firmware/efi/efivars)"
OUTPUT_LSCPU="$(lscpu | grep Vendor)"

echo $USER

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

SECRET=$(uuidgen)
curl qrenco.de/${SECRET}

printf "\nScan this code\n\n"

exit 1


read -sp "Enter root password: " PASSWORD_ROOT

PROCESSOR="amd"
FILE_SYSTEM="ext4"
PARTITION_BOOT="/dev/sda1"
PARTITION_ROOT="/dev/sda2"
EDITOR="nano"
KERNELS=("linux")
umount -R /mnt || /bin/true
mkfs.fat -F32 ${PARTITION_BOOT}
# TODO: remove above

TIMEZONE="Europe/Copenhagen"
LOCALES=("en_DK.UTF-8 UTF-8" "en_US.UTF-8 UTF-8")
# Installation cheatsheet
# Pre-installation (live environment)

# Use timedatectl to ensure the system clock is accurate:
timedatectl set-ntp true
# timedatectl set-timezone $TIMEZONE
# Format root partition
mkfs.${FILE_SYSTEM} ${PARTITION_ROOT}
# Mount root file system
mount ${PARTITION_ROOT} /mnt
# Create EFI mount point
mkdir /mnt/boot
# Mount EFI file system
mount ${PARTITION_BOOT} /mnt/boot




#<START>#

# Installation
function installation() {
    # Install base packages
    pacstrap /mnt \
        ${PROCESSOR}-ucode \
        ${KERNELS[*]} \
        ${EDITOR} \
        base \
        base-devel \
        linux-firmware
}

# Configuration
function configuration() {
    # Generate fstab file
    genfstab -U /mnt >> /mnt/etc/fstab
    # Set root password
    arch-chroot /mnt chpasswd <<< "root:${PASSWORD_ROOT}"
    # Set default editor
    echo 'EDITOR=vim' >> /mnt/etc/environment
}

# Localization
function localization() {
    # Set the time zone
    arch-chroot /mnt ln -sf /usr/share/zoneinfo/$TIMEZONE /etc/localtime
    # Write software UTC time to hardware
    arch-chroot /mnt hwclock --systohc
    #Uncomment locales to generate
    for LOCALE in ${LOCALES[*]}; do
        sed -i "s/#$LOCALE/$LOCALE/" /mnt/etc/locale.gen
    done
    #Generate locales
    arch-chroot /mnt locale-gen
    #Set LANG
    echo 'LANG=en_DK.UTF-8' > /mnt/etc/locale.conf
    #Persist keymap
    echo 'KEYMAP=dk' > /mnt/etc/vconsole.conf
}

# Networking
function networking() {
    # Set hostname
    echo 'ballz-pc' > /mnt/etc/hostname
    # Configure hosts file
    cat <<EOT > /mnt/etc/hosts
127.0.0.1	localhost
::1   	    localhost
EOT
    # Configure ethnernet
    cat <<EOT > /mnt/etc/systemd/network/20-ethernet.network
[Match]
Name=en*
Name=eth*

[Network]
DHCP=Yes
IPv6PrivacyExtensions=yes

[DHCP]
RouteMetric=512
EOT

    # Configure wireless
    cat <<EOT > /mnt/etc/systemd/network/20-wireless.network
[Match]
Name=wlp*
Name=wlan*

[Network]
DHCP=Yes
IPv6PrivacyExtensions=yes

[DHCP]
RouteMetric=1024
EOT

    arch-chroot /mnt systemctl enable \
        systemd-networkd \
        systemd-resolved
}

# Bootloader
function bootloader() {
    # Install bootloader
    arch-chroot /mnt bootctl install

    # Read UUID of root partiion
    PARTITION_ROOT_UUID=$(lsblk -dno UUID ${PARTITION_ROOT})

    # Add boot entry for each kernel
    for KERNEL in ${KERNELS[*]}; do
        cat <<EOT > /mnt/boot/loader/entries/arch-${KERNEL}.conf
title Arch (${KERNEL})
linux /vmlinuz-${KERNEL}
initrd /${PROCESSOR}-ucode.img
initrd /initramfs-${KERNEL}.img
options root="UUID=${PARTITION_ROOT_UUID}" rw
EOT
    done

    # Configure loader
    cat <<EOT > /mnt/boot/loader/loader.conf
default arch-${KERNEL[0]}
timeout 3
editor  no
EOT
}

function xorg() {
    # install a graphical gui interface
    arch-chroot /mnt pacman -Syu --noconfirm \
        termite \
        i3-wm \
        i3status \
        lightdm \
        lightdm-gtk-greeter \
        xorg-server \
        ttf-dejavu \
        ttf-inconsolata \
        noto-fonts \
        noto-fonts-emoji

    arch-chroot /mnt systemctl enable \
        lightdm

    # set X11 keymap
    cat <<EOT > /mnt/etc/X11/xorg.conf.d/00-keyboard.conf
# Written by systemd-localed(8), read by systemd-localed and Xorg. It's
# probably wise not to edit this file manually. Use localectl(1) to
# instruct systemd-localed to update it.
Section "InputClass"
        Identifier "system-keyboard"
        MatchIsKeyboard "on"
        Option "XkbLayout" "dk"
EndSection
EOT
}

#<END>#

installation
configuration
localization
networking
bootloader
xorg

exit 1
# Reboot into new system
# Unmount and reboot
umount -R /mnt/boot
umount -R /mnt
reboot
