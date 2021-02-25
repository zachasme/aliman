#!/usr/bin/env bash
set -e

#virsh destroy arch-linux_testing
#virsh undefine --nvram arch-linux_testing
virt-install  \
  --os-variant archlinux \
  --name arch-linux_testing \
  --memory 1024             \
  --vcpus=2,maxvcpus=4      \
  --cpu host                \
  --cdrom $HOME/Downloads/archlinux-*x86_64.iso \
  --disk size=2,format=qcow2  \
  --network user            \
  --boot uefi \
  --virt-type kvm