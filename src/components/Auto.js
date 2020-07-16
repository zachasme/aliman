import { h, Fragment } from "https://cdn.pika.dev/preact";
import { useEffect, useState } from "https://cdn.pika.dev/preact/hooks";

import firebase from "../firebase.js";
import Command from "../basic/Command.js";
import InputPartition from "../basic/InputPartition.js";

/** @type preact.FunctionComponent<{
 *   user: firebase.User
 * }>
 */
const Auto = ({ user }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (!user) return;
    return firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot((snapshot) => {
        setState(snapshot.data());
      });
  }, [user]);

  async function reset() {
    await firebase.firestore().collection("users").doc(user.uid).delete();
  }

  let devices = { blockdevices: [] };
  if (state?.lsblk) {
    devices = JSON.parse(state.lsblk);
    console.log(devices);
  }

  console.log(devices);

  return h(Fragment, null, [
    h("h1", null, "Unattended Arch Install"),

    h("button", { onClick: reset }, "reset"),

    h(Command, {
      command: `loadkeys dk`,
    }),
    h(Command, {
      command: `curl ${window.location.origin}/info.sh | bash -s ${user?.uid}`,
    }),
    state
      ? h(Fragment, null, [
          h("div", { style: { display: "flex", margin: "2rem" } }, [
            h("label", null, [
              h("span", null, "Select boot partition"),
              h(InputPartition, { devices: devices.blockdevices }),
            ]),
            h("label", null, [
              h("span", null, "Select root partition"),
              h(InputPartition, { devices: devices.blockdevices }),
            ]),
          ]),
          h(Command, {
            command: `curl ${window.location.origin}/install.sh | bash -s ${user?.uid}`,
          }),
        ])
      : h("p", null, "waiting..."),
  ]);
};

export default Auto;
