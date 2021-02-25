import { useState } from "react";
import Instructions from "../components/Instructions";

const Text: React.FC<any> = (props) => {
  return (
    <input
      className={`
        mt-1 block w-full py-2 px-3
        border
        bg-white border-gray-300
        dark:bg-gray-800 dark:border-gray-700
        rounded-md shadow-sm
        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
        sm:text-sm`}
      {...props}
    />
  );
};

const Select: React.FC<any> = ({ options, value, ...props }) => {
  return (
    <select
      {...props}
      id="country"
      name="country"
      autoComplete="country"
      className={`
    mt-1 block w-full py-2 px-3
    border
    bg-white border-gray-300
    dark:bg-gray-800 dark:border-gray-700
    rounded-md shadow-sm
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
    sm:text-sm`}
    >
      {Object.entries(options).map(([id, text]) => {
        return (
          <option key={id} value={id} selected={value === id}>
            {text}
          </option>
        );
      })}
    </select>
  );
};

const Guide: React.FC = () => {
  const [isNotesEnabled, setIsNotesEnabled] = useState(true);
  const [processor, setProcessor] = useState("amd");
  const [editor, setEditor] = useState("vim");
  const [fileSystem, setFileSystem] = useState("btrfs");
  const [graphics, setGraphics] = useState("nvidia");
  const [hostname, setHostname] = useState("ballz");
  const [locale, setLocale] = useState("en_DK.UTF-8");
  const [kernel, setKernel] = useState("linux");
  const [keymap, setKeymap] = useState("dk");
  const [partitionDevice, setPartitionDevice] = useState("/dev/sda");
  const [partitionBoot, setPartitionBoot] = useState("/dev/sda1");
  const [partitionRoot, setPartitionRoot] = useState("/dev/sda2");
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="print:hidden container mx-auto px-16">
        <div className="flex">
          <label>
            Device
            <Text
              size={10}
              value={partitionDevice}
              onChange={(e) => setPartitionDevice(e.target.value)}
            />
          </label>

          <label>
            Boot
            <Text
              size={10}
              value={partitionBoot}
              onChange={(e) => setPartitionBoot(e.target.value)}
            />
          </label>

          <label>
            Root
            <Text
              size={10}
              value={partitionRoot}
              onChange={(e) => setPartitionRoot(e.target.value)}
            />
          </label>

          <label>
            Editor
            <Select
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              options={{
                ["vim"]: "vim",
                ["nano"]: "nano",
              }}
            />
          </label>

          <label>
            Filesystem
            <Select
              value={fileSystem}
              onChange={(e) => setFileSystem(e.target.value)}
              options={{
                ["ext4"]: "ext4 (tried and tested)",
                ["btrfs"]: "btrfs (get snapshots)",
              }}
            />
          </label>

          <label>
            CPU Vendor
            <Select
              value={processor}
              onChange={(e) => setProcessor(e.target.value)}
              options={{
                ["amd"]: "AMD cpu",
                ["intel"]: "Intel cpu",
              }}
            />
          </label>

          <label>
            Graphics
            <Select
              value={graphics}
              onChange={(e) => setGraphics(e.target.value)}
              options={{
                ["intel"]: "intel",
                ["amdgpu"]: "amdgpu",
                ["nvidia"]: "nvidia",
              }}
            />
          </label>

          <label>
            Kernel
            <Select
              value={kernel}
              onChange={(e) => setKernel(e.target.value)}
              options={{
                ["linux"]: "Stable (linux)",
                ["linux-lts"]: "Longterm (linux-lts)",
                ["linux-hardened"]: "Hardened (linux-hardened)",
                ["linux-zen"]: "Zen (linux-zen)",
              }}
            />
          </label>

          <label>
            Hostname
            <Text
              size={5}
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
            />
          </label>

          <label>
            Time Zone
            <Text
              size={15}
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
            />
          </label>

          <label>
            System Locale
            <Text
              size={10}
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            />
          </label>

          <label>
            Keymap
            <Text
              size={3}
              value={keymap}
              onChange={(e) => setKeymap(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="container mx-auto px-16 print:px-0">
        <Instructions
          editor={editor}
          fileSystem={fileSystem}
          graphics={graphics}
          hostname={hostname}
          locale={locale}
          kernel={kernel}
          keymap={keymap}
          partitionDevice={partitionDevice}
          partitionBoot={partitionBoot}
          partitionRoot={partitionRoot}
          processor={processor}
          timeZone={timeZone}
          isNotesEnabled={isNotesEnabled}
        />
      </div>
    </main>
  );
};

export default Guide;
