import { h } from "https://cdn.pika.dev/preact";

/** @type preact.FunctionComponent<{
 *   devices: any[]
 * }>
 */
const InputPartition = ({ devices }) => {
  return h("select", null, [
    h("option", { disabled: true }, "Select partition"),
    ...devices.map((device) =>
      h(
        "optgroup",
        { label: `${device.path} (${device.size}B) ${device.model}` },
        device.children.map((child) =>
          h(
            "option",
            null,
            `${child.name} (${child.size}B) ${child.parttypename}`
          )
        )
      )
    ),
  ]);
};

export default InputPartition;
