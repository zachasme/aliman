export interface BaseStep {
  title?: string;
  note?: string;
  skip?: boolean;
  chroot?: boolean;
}

export interface TextStep extends BaseStep {
  type: "text";
}

export interface WriteStep extends BaseStep {
  type: "write";
  path: string;
  lines: string[];
}

export interface CommandStep extends BaseStep {
  type: "command";
  command: string;
  store?: string;
}

export type Step = CommandStep | TextStep | WriteStep;

export interface Section {
  title: string;
  steps: Step[];
}

export type BootMode = "uefi";
export type Processor = "amd";
export type Editor = "vim";
export type FileSystem = "ext4";
export type Kernel = string;

export enum Graphics {
  Intel = "intel",
  AmdGPU = "amdgpu",
  Nvidia = "nvidia",
}

export interface Options {
  bootMode: BootMode;
  processor: Processor;
  editor: Editor;
  graphics: Graphics;
  fileSystem: FileSystem;
  kernel: Kernel;
  username: string;
  hostname: string;
  partitionDevice: string;
  partitionBoot: string;
  partitionRoot: string;
}

export const defaultOptions: Options = {
  bootMode: "uefi",
  editor: "vim",
  graphics: Graphics.Intel,
  fileSystem: "ext4",
  kernel: "linux",
  processor: "amd",
  username: "zach",
  hostname: "ballz-pc",
  partitionDevice: "/dev/sda",
  partitionBoot: "/dev/sda1",
  partitionRoot: "/dev/sda2",
};

export default function steps(options: Options): Section[] {
  const packages: string[] = [
    "base",
    "base-devel",
    options.kernel,
    "linux-firmware",
    `${options.processor}-ucode`,
    options.editor,
  ];
  if (options.graphics === Graphics.Nvidia) {
    if (options.kernel === "linux") {
      packages.push("nvidia");
    } else if (options.kernel === "linux-lts") {
      packages.push("nvidia-lts");
    } else {
      // we will need dkms
      packages.push("nvidia-dkms");
      packages.push(`${options.kernel}-headers`);
    }
  }

  return [
    {
      title: "Pre-installation (live environment)",
      steps: [
        {
          skip: true,
          type: "text",
          title: "Boot the live environment",
          note:
            "Aquire an installation media, verify signature, prepare installation medium and boot the live environment as per the offical Installation Guide.",
        },
        {
          skip: true,
          type: "command",
          title: "Set keyboard layout",
          command: "loadkeys dk",
        },
        {
          skip: true,
          type: "command",
          title: "Verify EFI boot mode",
          command: "ls /sys/firmware/efi/efivars",
          note:
            "If the directory does not exist, you need to find a way to reboot into EFI boot mode",
        },
        {
          type: "command",
          title: "Update system clock",
          command: "timedatectl set-ntp true",
        },
        {
          skip: true,
          type: "command",
          title: "Partition the disks",
          command: `gdisk ${options.partitionDevice}`,
          note: `Example: ${options.partitionBoot} EFI partition 260 MiB, ${options.partitionRoot} linux partition remaining space`,
        },
        {
          skip: true,
          type: "command",
          title: "Format EFI partition",
          command: `mkfs.fat -F32 ${options.partitionBoot}`,
          note:
            "IMPORTANT: Refer to the wiki if you are dual booting, formatting your EFI partition will most likely make Windows unbootable",
        },
        {
          type: "command",
          title: "Format root partition",
          command: `mkfs.${options.fileSystem} ${options.partitionRoot}`,
        },
        {
          type: "command",
          title: "Mount root file system",
          command: `mount ${options.partitionRoot} /mnt`,
        },
        {
          type: "command",
          title: "Create EFI mount point",
          command: "mkdir /mnt/boot",
        },
        {
          type: "command",
          title: "Mount EFI file system",
          command: `mount ${options.partitionBoot} /mnt/boot`,
        },
      ],
    },
    {
      title: "Installation",
      steps: [
        {
          skip: true,
          type: "command",
          title: "Sort download mirrors",
          command: `reflector --verbose --latest 5 --sort rate --save /etc/pacman.d/mirrorlist`,
        },
        {
          type: "command",
          title: "Install base packages",
          command: `pacstrap /mnt ${packages.join(" ")}`,
        },
      ],
    },

    {
      title: "Configuration",
      steps: [
        {
          type: "command",
          title: "Generate fstab file",
          command: "genfstab -U /mnt >> /mnt/etc/fstab",
        },
        {
          type: "command",
          title: "Copy default network config",
          command: "cp /etc/systemd/network/* /mnt/etc/systemd/network/",
        },
        {
          type: "command",
          title: "Change root into new system",
          command: "arch-chroot /mnt",
        },
        {
          type: "command",
          chroot: true,
          title: "Set root password",
          command: "passwd",
        },
        {
          type: "command",
          chroot: true,
          title: "Set default editor",
          command: `echo 'EDITOR=${options.editor}' >> /etc/environment`,
        },
      ],
    },

    {
      title: "Localization",
      steps: [
        {
          type: "command",
          chroot: true,
          title: "Set the time zone",
          command:
            "ln -sf /usr/share/zoneinfo/Europe/Copenhagen /etc/localtime",
        },
        {
          type: "command",
          chroot: true,
          title: "Write software UTC time to hardware",
          command: "hwclock --systohc",
        },
        {
          type: "write",
          chroot: true,
          title: "Uncomment locales to generate",
          path: "/etc/locale.gen",
          lines: ["en_DK.UTF-8 UTF-8", "en_US.UTF-8 UTF-8"],
        },
        {
          type: "command",
          chroot: true,
          title: "Generate locales",
          command: "locale-gen",
        },
        {
          type: "command",
          chroot: true,
          title: "Set LANG",
          command: "echo 'LANG=en_DK.UTF-8' > /etc/locale.conf",
        },
        {
          type: "command",
          chroot: true,
          title: "Persist keymap",
          command: "echo 'KEYMAP=dk' > /etc/vconsole.conf",
        },
      ],
    },

    {
      title: "Networking",
      steps: [
        {
          type: "command",
          chroot: true,
          title: "Set hostname",
          command: "echo 'ballz-pc' > /etc/hostname",
        },
        {
          type: "write",
          chroot: true,
          title: "Configure hosts file",
          path: "/etc/hosts",
          lines: ["127.0.0.1\tlocalhost", "::1\t\tlocalhost"],
        },
        {
          type: "command",
          chroot: true,
          title: "Use systemd DNS stub file",
          command:
            "ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf",
        },
        {
          type: "command",
          chroot: true,
          title: "Enable systemd network services",
          command: "systemctl enable systemd-networkd systemd-resolved",
        },
      ],
    },

    {
      title: "Initial ramdisks",
      steps: [
        {
          type: "write",
          chroot: true,
          title: "Configure mkinitcpio",
          path: "/etc/mkinitcpio.conf",
          lines: [
            `HOOKS=(systemd autodetect modconf block filesystems keyboard fsck)`,
          ],
        },
        {
          type: "command",
          chroot: true,
          title: "Regenereate initramfs images",
          command: "mkinitcpio --allpresets",
        },
      ],
    },
    {
      title: "Bootloader",
      steps: [
        {
          type: "command",
          chroot: true,
          title: "Install bootloader",
          command: "bootctl install",
          note:
            "You can also edit /boot/loader/loader.conf to increase timeout if you are dual booting-windows (otherwise you will boot directly to linux)",
        },
        {
          type: "write",
          chroot: true,
          title: "Configure bootloader",
          path: "/boot/loader/entries/arch.conf",
          lines: [
            `title Arch (${options.kernel})`,
            `linux /vmlinuz-${options.kernel}`,
            `initrd /${options.processor}-ucode.img`,
            `initrd /initramfs-${options.kernel}.img`,
            `options rw`,
          ],
        },
        {
          type: "write",
          chroot: true,
          title: "Add fallback entry",
          path: "/boot/loader/entries/arch-fallback.conf",
          lines: [
            `title Arch (${options.kernel}-fallback)`,
            `linux /vmlinuz-${options.kernel}`,
            `initrd /${options.processor}-ucode.img`,
            `initrd /initramfs-${options.kernel}-fallback.img`,
            `options rw`,
          ],
        },
      ],
    },

    {
      title: "Reboot into new system",
      steps: [
        {
          skip: true,
          chroot: true,
          type: "command",
          title: "Leave chroot",
          command: "exit",
        },
        {
          skip: true,
          type: "command",
          title: "Unmount and reboot",
          command: "umount --recursive /mnt && reboot",
        },
      ],
    },

    /*{
      title: "Userspace setup",
      steps: [
        {
          type: "command",
          chroot: true,
          title: "Enable systemd-homed",
          command: "systemctl enable systemd-homed",
        },
        {
          skip: true,
          type: "command",
          chroot: true,
          title: "Create regular user",
          command: "homectl create zach --member-of=wheel",
          //command: "useradd --create-home --groups wheel zach",
          note: "The `wheel` group is for sudo",
        },
        {
          skip: true,
          type: "command",
          chroot: true,
          title: "Enable sudo for wheel group",
          command: "visudo",
          note:
            "Uncomment '%wheel ALL=(ALL) ALL' the above to allow members of group `wheel` to execute any command (after entering root password)",
        },
        {
          skip: true,
          type: "command",
          title: "Change to regular user",
          command: "su zach",
        },
      ],
    },

    {
      title: "Install aurman",
      steps: [
        {
          skip: true,
          type: "command",
          command:
            "curl -L -O https://aur.archlinux.org/cgit/aur.git/snapshot/aurman.tar.gz",
        },
        {
          skip: true,
          type: "command",
          title: "Import GnuPG key",
          command: "gpg --recv-keys 465022E743D71E39",
        },
        {
          skip: true,
          type: "command",
          title: "Unpack",
          command: "tar -xvf aurman.tar.gz",
        },
        {
          skip: true,
          type: "command",
          command: "cd aurman",
        },
        {
          skip: true,
          type: "command",
          title: "Compile and install",
          command: "makepkg -si",
        },
      ],
    },

    {
      title: "Install important AUR packages",
      steps: [
        {
          skip: true,
          type: "command",
          command: "aurman -Syu systemd-boot-pacman-hook",
          note:
            "IMPORTANT: the bootctl update hook is needed to ensure microcode updates",
        },
      ],
    },
    {
      title: "Install all the good shit",
      steps: [
        {
          skip: true,
          type: "command",
          command: "sudo pacman -Syu xorg docker openssh termite ...",
        },
      ],
    },*/
  ];
}
