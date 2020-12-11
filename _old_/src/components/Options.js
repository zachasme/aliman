import { h } from "https://cdn.pika.dev/preact";

import { BootMode, Processor, Editor, FileSystem, Kernel } from "../types.js";

import InputEnum from "../basic/InputEnum.js";

/** @typedef { import("../types.js").Configuration } Configuration */

/** @type preact.FunctionComponent<{
 *   configuration: Configuration;
 *   setConfiguration(configuration: Configuration): void;
 * }>
 */
const Options = ({ configuration, setConfiguration }) => {
  /**
   * @param {Partial<Configuration>} change
   */
  function update(change) {
    setConfiguration({ ...configuration, ...change });
  }

  return h("form", null, [
    h(InputEnum, {
      options: BootMode,
      legend: "Boot Mode",
      name: "boot_mode",
      value: configuration.bootMode,
      onChange: (bootMode) => update({ bootMode }),
      wiki: "Unified_Extensible_Firmware_Interface",
    }),
    h(InputEnum, {
      options: Processor,
      legend: "CPU Vendor",
      name: "processor",
      value: configuration.processor,
      onChange: (processor) => update({ processor }),
      wiki: "Microcode",
    }),
    h(InputEnum, {
      options: Editor,
      legend: "Editor",
      name: "editor",
      value: configuration.editor,
      onChange: (editor) => update({ editor }),
      wiki: "Category:Text_editors",
    }),
    h(InputEnum, {
      options: FileSystem,
      legend: "File System",
      name: "file_system",
      value: configuration.fileSystem,
      onChange: (fileSystem) => update({ fileSystem }),
      wiki: "Category:File_systems",
    }),
    h(InputEnum, {
      options: Kernel,
      legend: "Kernel(s)",
      name: "kernels",
      value: configuration.kernel,
      onChange: (kernel) => update({ kernel }),
      wiki: "Kernel",
      multiple: true,
    }),
  ]);
};

export default Options;
