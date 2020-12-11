import { h, Fragment } from "https://cdn.pika.dev/preact";

/** @type preact.FunctionComponent<{
 *   command: string
 * }>
 */
const Command = ({ command }) => {
  async function copy() {
    await navigator.clipboard.writeText(command);
  }

  return h("code", { onClick: copy }, command);
};

export default Command;
