import { useState } from "react";
import Instructions from "./Instructions";

import { KEYMAPS, LOCALES } from "../lib/constants";

const Text: React.FC<any> = (props) => {
  return <input {...props} />;
};

const Select: React.FC<any> = ({ options, value, ...props }) => {
  return (
    <select
      {...props}
      id="country"
      name="country"
      autoComplete="country"
      value={value}
    >
      {Object.entries(options).map(([id, text]) => {
        return (
          <option key={id} value={id}>
            {text as any}
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
    <main>
      <div>
        <div>
          <label>
            Device
            <Text
              size={10}
              value={partitionDevice}
              onChange={(e: any) => setPartitionDevice(e.target.value)}
            />
          </label>

          <label>
            Boot
            <Text
              size={10}
              value={partitionBoot}
              onChange={(e: any) => setPartitionBoot(e.target.value)}
            />
          </label>

          <label>
            Root
            <Text
              size={10}
              value={partitionRoot}
              onChange={(e: any) => setPartitionRoot(e.target.value)}
            />
          </label>

          <label>
            Editor
            <Select
              value={editor}
              onChange={(e: any) => setEditor(e.target.value)}
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
              onChange={(e: any) => setFileSystem(e.target.value)}
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
              onChange={(e: any) => setProcessor(e.target.value)}
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
              onChange={(e: any) => setGraphics(e.target.value)}
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
              onChange={(e: any) => setKernel(e.target.value)}
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
              onChange={(e: any) => setHostname(e.target.value)}
            />
          </label>

          <label>
            Time Zone
            <Text
              size={15}
              value={timeZone}
              onChange={(e: any) => setTimeZone(e.target.value)}
            />
          </label>

          <label>
            System Locale
            <Select
              value={locale}
              onChange={(e: any) => setLocale(e.target.value)}
              options={Object.fromEntries(LOCALES.map((x) => [x, x]))}
            />
          </label>

          <label>
            Keymap
            <Select
              value={keymap}
              onChange={(e: any) => setKeymap(e.target.value)}
              options={Object.fromEntries(KEYMAPS.map((x) => [x, x]))}
            />
          </label>
        </div>
      </div>
      <div className="App">
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
