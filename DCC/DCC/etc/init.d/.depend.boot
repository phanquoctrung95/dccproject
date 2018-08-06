TARGETS = console-setup resolvconf mountkernfs.sh ufw plymouth-log x11-common screen-cleanup apparmor hostname.sh udev keyboard-setup mountdevsubfs.sh procps cryptdisks cryptdisks-early iscsid networking checkroot.sh lvm2 hwclock.sh urandom checkfs.sh open-iscsi checkroot-bootclean.sh bootmisc.sh mountall.sh mountall-bootclean.sh mountnfs-bootclean.sh mountnfs.sh kmod
INTERACTIVE = console-setup udev keyboard-setup cryptdisks cryptdisks-early checkroot.sh checkfs.sh
udev: mountkernfs.sh
keyboard-setup: mountkernfs.sh udev
mountdevsubfs.sh: mountkernfs.sh udev
procps: mountkernfs.sh udev
cryptdisks: checkroot.sh cryptdisks-early udev lvm2
cryptdisks-early: checkroot.sh udev
iscsid: networking
networking: resolvconf mountkernfs.sh urandom procps
checkroot.sh: hwclock.sh keyboard-setup mountdevsubfs.sh hostname.sh
lvm2: cryptdisks-early mountdevsubfs.sh udev
hwclock.sh: mountdevsubfs.sh
urandom: hwclock.sh
checkfs.sh: cryptdisks lvm2 checkroot.sh
open-iscsi: networking iscsid
checkroot-bootclean.sh: checkroot.sh
bootmisc.sh: checkroot-bootclean.sh mountall-bootclean.sh mountnfs-bootclean.sh udev
mountall.sh: checkfs.sh checkroot-bootclean.sh lvm2
mountall-bootclean.sh: mountall.sh
mountnfs-bootclean.sh: mountnfs.sh
mountnfs.sh: networking
kmod: checkroot.sh
