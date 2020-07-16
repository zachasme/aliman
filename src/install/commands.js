export default [];

/*
Installation cheatsheet
Pre-installation (live environment)

    Set keyboard layout
    loadkeys dk
    Verify EFI boot mode
    ls /sys/firmware/efi/efivars

    If the directory does not exist, you need to find a way to reboot into EFI boot mode
    Update system clock
    timedatectl set-ntp true
    Partition the disks
    gdisk /dev/nvme0n1p

    Example: /dev/nvme0n1p1 EFI partition 550 MiB, /dev/nvme0n1p2 linux partition remaining space
    Format EFI partition
    mkfs.fat -F32 /dev/nvme0n1p1

    IMPORTANT: Refer to the wiki if you are dual booting, formatting your EFI partition will most likely make Windows unbootable
    Format root partition
    mkfs.ext4 /dev/nvme0n1p2
    Mount root file system
    mount /dev/nvme0n1p2 /mnt
    Create EFI mount point
    mkdir /mnt/boot
    Mount EFI file system
    mount /dev/nvme0n1p1 /mnt/boot

Installation

    Choose download mirrors
    vim /etc/pacman.d/mirrorlist

    The higher a mirror is placed in the list, the more priority it is given when downloading a package. You may want to edit the file accordingly, and move the geographically closest mirrors to the top of the list, although other criteria should be taken into account. This file will later be copied to the new system by pacstrap, so it is worth getting right.
    Install base packages
    pacstrap /mnt linux vim base base-devel amd‑ucode

    NOTE: If you are fucked, it might help to install linux-firmware

Configuration

    Generate fstab file
    genfstab -U /mnt >> /mnt/etc/fstab
    Change root into new system
    arch-chroot /mnt
    Set root password
    passwd
    Set default editor
    echo 'EDITOR=vim' >> /etc/environment

Localization

    Set the time zone
    ln -sf /usr/share/zoneinfo/Europe/Copenhagen /etc/localtime
    Write software UTC time to hardware
    hwclock --systohc
    Uncomment locales to generate
    vim /etc/locale.gen

    en_DK.UTF-8 UTF-8
    en_US.UTF-8 UTF-8

    Generate locales
    locale-gen
    Set LANG
    echo 'LANG=en_DK.UTF-8' > /etc/locale.conf
    Persist keymap
    echo 'KEYMAP=dk' > /etc/vconsole.conf

Networking

    Set hostname
    echo 'ballz-pc' > /etc/hostname
    Configure hosts file
    vim /etc/hosts

    127.0.0.1	localhost
    ::1		localhost

Bootloader

    Install bootloader
    bootctl install
    Read UUID of root partition
    lsblk -dno UUID /dev/nvme0n1p2

    You will need this for the next step
    Configure bootloader
    vim /boot/loader/entries/arch.conf

    title Arch Linux (linux)
    linux /vmlinuz-linux
    initrd /amd-ucode.img
    initrd /initramfs-linux.img
    options root="UUID=put-here-the-uuid-you-got-above" rw

    You can also edit /boot/loader/loader.conf to increase timeout if you are dual booting-windows (otherwise you will boot directly to linux)
    Reboot into new system
    Leave chroot
    exit
    Unmount and reboot
    umount -R /mnt && reboot

Userspace setup

    Create regular user
    useradd --create-home --groups wheel zach

    The `wheel` group is for sudo
    Set user password
    passwd zach
    Enable sudo for wheel group
    visudo

    %wheel ALL=(ALL) ALL

    Uncomment the above to allow members of group `wheel` to execute any command (after entering root password)
    Change to regular user
    su zach

Install aurman

    curl -L -O https://aur.archlinux.org/cgit/aur.git/snapshot/aurman.tar.gz
    Import GnuPG key
    gpg --recv-keys 465022E743D71E39
    Unpack
    tar -xvf aurman.tar.gz
    cd aurman
    Compile and install
    makepkg -si

Install important AUR packages

    aurman -Syu systemd-boot-pacman-hook

    IMPORTANT: the bootctl update hook is needed to ensure microcode updates

Install all the good shit

    sudo pacman -Syu xorg docker openssh termite ...
 */
