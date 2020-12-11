/** @enum {string} */
export const BootMode = {
  UEFI: "UEFI",
  BIOS: "BIOS",
};
/** @enum {string} */
export const Processor = {
  AMD: "AMD",
  INTEL: "Intel",
};
/** @enum {string} */
export const Editor = {
  VIM: "vim",
  NANO: "nano",
};
/** @enum {string} */
export const FileSystem = {
  EXT4: "ext4",
  BTRFS: "btrfs",
};
/** @enum {string} */
export const Kernel = {
  LINUX: "linux",
  LINUX_LTS: "linux-lts",
  LINUX_HARDENED: "linux-hardened",
  LINUX_ZEN: "linux-zen",
};

/**
 * @typedef {object} Configuration
 * @property {Processor} processor
 * @property {BootMode} bootMode
 * @property {Editor} editor
 * @property {FileSystem} fileSystem
 * @property {Kernel} kernel
 * @property {string} username
 * @property {string} hostname
 * @property {string} partitionDevice
 * @property {string} partitionBoot
 * @property {string} partitionRoot
 */
