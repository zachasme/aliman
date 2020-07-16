import { h } from "https://cdn.pika.dev/preact";
import { useState, useEffect } from "https://cdn.pika.dev/preact/hooks";

import { Processor, BootMode, Editor, FileSystem, Kernel } from "../types.js";
import firebase from "../firebase.js";

import Options from "./Options.js";

/** @typedef { import("../types.js").Configuration } Configuration */

/** @type Configuration */
const INITIAL_CONFIGURATION = {
  processor: Processor.INTEL,
  bootMode: BootMode.UEFI,
  editor: Editor.NANO,
  fileSystem: FileSystem.EXT4,
  kernel: Kernel.LINUX,
  username: "zach",
  hostname: "ballz-pc",
  partitionDevice: "nvme",
  partitionBoot: "fsda",
  partitionRoot: "asfd",
};

/** @type preact.FunctionComponent<{
 *   user: firebase.User
 * }>
 */
const Home = ({ user }) => {
  const [configuration, setLocalConfiguration] = useState(
    INITIAL_CONFIGURATION
  );

  /** @param {Configuration} configuration */
  function setConfiguration(configuration) {
    setLocalConfiguration(configuration);
    firebase
      .firestore()
      .collection("configurations")
      .doc(user.uid)
      .set(configuration);
  }

  useEffect(() => {
    if (!user) return;
    firebase
      .firestore()
      .collection("configurations")
      .doc(user.uid)
      .get()
      .then((snapshot) => {
        setLocalConfiguration({ ...configuration, ...snapshot.data() });
      });
  }, [user]);

  return h("p", null, h(Options, { configuration, setConfiguration }));
};

export default Home;
