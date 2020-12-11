interface Step {
  title?: string;
  code: string;
  note?: string;
  input?: string;
}

interface Section {
  title: string;
  steps: Step[];
}

export default function steps(): Section[] {
  return [
    {
      title: "Pre-installation (live environment)",
      steps: [
        { title: "Set keyboard layout", code: "loadkeys dk" },
        {
          title: "Verify EFI boot mode",
          code: "ls /sys/firmware/efi/efivars",
          note:
            "If the directory does not exist, you need to find a way to reboot into EFI boot mode",
        },
        {
          title: "Update system clock",
          code: "timedatectl set-ntp true",
        },
        {
          title: "Partition the disks",
          code: "gdisk /dev/nvme0n1p",
          note:
            "Example: /dev/nvme0n1p1 EFI partition 550 MiB, /dev/nvme0n1p2 linux partition remaining space",
        },
        {
          title: "Format EFI partition",
          code: "mkfs.fat -F32 /dev/nvme0n1p1",
          note:
            "IMPORTANT: Refer to the wiki if you are dual booting, formatting your EFI partition will most likely make Windows unbootable",
        },
        {
          title: "Format root partition",
          code: "mkfs.ext4 /dev/nvme0n1p2",
        },
        {
          title: "Mount root file system",
          code: "mount /dev/nvme0n1p2 /mnt",
        },
        {
          title: "Create EFI mount point",
          code: "mkdir /mnt/boot",
        },
        {
          title: "Mount EFI file system",
          code: "mount /dev/nvme0n1p1 /mnt/boot",
        },
      ],
    },
    {
      title: "Installation",
      steps: [
        {
          title: "Choose download mirrors",
          code: "vim /etc/pacman.d/mirrorlist",
          note:
            "The higher a mirror is placed in the list, the more priority it is given when downloading a package. You may want to edit the file accordingly, and move the geographically closest mirrors to the top of the list, although other criteria should be taken into account. This file will later be copied to the new system by pacstrap, so it is worth getting right.",
        },
        {
          title: "Install base packages",
          code:
            "pacstrap /mnt vim base base-devel linux linux-firmware intel‑ucode",
        },
      ],
    },

    {
      title: "Localization",
      steps: [
        {
          title: "Set the time zone",
          code: "ln -sf /usr/share/zoneinfo/Europe/Copenhagen /etc/localtime",
        },
        {
          title: "Write software UTC time to hardware",
          code: "hwclock --systohc",
        },
        {
          title: "Uncomment locales to generate",
          code: "vim /etc/locale.gen",
          input: `
    en_DK.UTF-8 UTF-8
    en_US.UTF-8 UTF-8
    `,
        },
        {
          title: "Generate locales",
          code: "locale-gen",
        },
        {
          title: "Set LANG",
          code: "echo 'LANG=en_DK.UTF-8' > /etc/locale.conf",
        },
        {
          title: "Persist keymap",
          code: "echo 'KEYMAP=dk' > /etc/vconsole.conf",
        },
      ],
    },
    {
      title: "Networking",
      steps: [
        { title: "Set hostname", code: "echo 'ballz-pc' > /etc/hostname" },
        {
          title: "Configure hosts file",
          code: "vim /etc/hosts",
          input: `
  
  127.0.0.1	localhost
  ::1		localhost
  `,
        },
      ],
    },
    {
      title: "Bootloader",
      steps: [
        { title: "Install bootloader", code: "bootctl install" },
        {
          title: "Read UUID of root partition",
          code: "lsblk -dno UUID /dev/nvme0n1p2",
          note: "You will need this for the next step",
        },
        {
          title: "Configure bootloader",
          code: "vim /boot/loader/entries/arch.conf",
          input: `
  title Arch Linux (linux)
  linux /vmlinuz-linux
  initrd /intel-ucode.img
  initrd /initramfs-linux.img
  options root="UUID=put-here-the-uuid-you-got-above" rw
  `,
          note:
            "You can also edit /boot/loader/loader.conf to increase timeout if you are dual booting-windows (otherwise you will boot directly to linux)",
        },
      ],
    },

    {
      title: "Userspace setup",
      steps: [
        {
          title: "Create regular user",
          code: "useradd --create-home --groups wheel zach",
          note: "The `wheel` group is for sudo",
        },
        { title: "Set user password", code: "passwd zach" },
        {
          title: "Enable sudo for wheel group",
          code: "visudo",
          input: `
  
    %wheel ALL=(ALL) ALL
    `,
          note:
            "Uncomment the above to allow members of group `wheel` to execute any command (after entering root password)",
        },
        { title: "Change to regular user", code: "su zach" },
      ],
    },

    {
      title: "Install aurman",
      steps: [
        {
          code:
            "curl -L -O https://aur.archlinux.org/cgit/aur.git/snapshot/aurman.tar.gz",
        },
        { title: "Import GnuPG key", code: "gpg --recv-keys 465022E743D71E39" },
        { title: "Unpack", code: "tar -xvf aurman.tar.gz" },
        { code: "cd aurman" },
        { title: "Compile and install", code: "makepkg -si" },
      ],
    },

    {
      title: "Install important AUR packages",
      steps: [
        {
          code: "aurman -Syu systemd-boot-pacman-hook",
          note:
            "IMPORTANT: the bootctl update hook is needed to ensure microcode updates",
        },
      ],
    },
    {
      title: "Install all the good shit",
      steps: [{ code: "sudo pacman -Syu xorg docker openssh termite ..." }],
    },
  ];
}
