#!/usr/bin/env bash
set -e

echo "Select root password: "
read -s PASSWORD_ROOT
echo "Select user password: "
read -s PASSWORD_USER

TIMEZONE="Europe/Copenhagen"
LOCALES=("en_DK.UTF-8 UTF-8" "en_US.UTF-8 UTF-8")
PARTITION_ROOT_UUID=$(lsblk -dno UUID ${PARTITION_ROOT})

exit 1

# Installation cheatsheet
## Pre-installation (live environment)

### Update system clock
timedatectl set-ntp true
### Format root partition
mkfs.${FILE_SYSTEM} ${PARTITION_ROOT}
### Mount root file system
mount /dev/nvme0n1p2 /mnt
### Create EFI mount point
mkdir /mnt/boot
### Mount EFI file system
mount /dev/nvme0n1p1 /mnt/boot

## Installation

### Choose download mirrors
#### The higher a mirror is placed in the list, the more priority it is given when downloading a package. You may want to edit the file accordingly, and move the geographically closest mirrors to the top of the list, although other criteria should be taken into account. This file will later be copied to the new system by pacstrap, so it is worth getting right.
#vim /etc/pacman.d/mirrorlist
### Install base packages
pacstrap /mnt ${EDITOR} base base-devel ${KERNEL} linux-firmware amd‑ucode

## Configuration

### Generate fstab file
genfstab -U /mnt >> /mnt/etc/fstab
### Set root password
echo $PASSWORD_ROOT | arch-chroot /mnt chpasswd --stdin
### Set default editor
echo 'EDITOR=vim' >> /mnt/etc/environment

## Localization

### Set the time zone
arch-chroot /mnt ln -sf /usr/share/zoneinfo/$TIMEZONE /etc/localtime
### Write software UTC time to hardware
arch-chroot /mnt hwclock --systohc
###Uncomment locales to generate
for LOCALE in "${LOCALES[@]}"; do
    sed -i "s/#$LOCALE/$LOCALE/" /mnt/etc/locale.gen
done
###Generate locales
locale-gen
###Set LANG
echo 'LANG=en_DK.UTF-8' > /mnt/etc/locale.conf
###Persist keymap
echo 'KEYMAP=dk' > /mnt/etc/vconsole.conf

## Networking

###Set hostname
echo 'ballz-pc' > /mnt/etc/hostname
###Configure hosts file
echo '127.0.0.1	localhost' > /mnt/etc/hosts
echo '::1   	localhost' > /mnt/etc/hosts

## Bootloader

### Install bootloader
arch-chroot /mnt bootctl install
### Read UUID of root partition
### Configure bootloader
echo "title Arch Linux (${KERNEL})"                     >> /boot/loader/entries/arch.conf
echo "linux /vmlinuz-${KERNEL}"                         >> /boot/loader/entries/arch.conf
echo "initrd /${PROCESSOR}-ucode.img"                   >> /boot/loader/entries/arch.conf
echo "initrd /initramfs-${KERNEL}.img"                  >> /boot/loader/entries/arch.conf
echo "options root="UUID=${PARTITION_ROOT_UUID}" rw"    >> /boot/loader/entries/arch.conf
cat <<EOT > "/mnt/loader/loader.conf"
default archlinux
timeout 3
editor  no
EOT

## Reboot into new system
### Unmount and reboot
umount -R /mnt/boot
umount -R /mnt
reboot
