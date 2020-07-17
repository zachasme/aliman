import { h } from "https://cdn.pika.dev/preact";

const WIKI_BASE = "https://wiki.archlinux.org/index.php/";

/**
 * @type preact.FunctionComponent<{
 *   options: Record<string,string>
 *   legend: string;
 *   name: string;
 *   value: string;
 *   onChange?(x: any): any;
 *   wiki: string;
 *   multiple?: boolean;
 * }>
 */
const InputEnum = ({
  options,
  legend,
  name,
  value,
  wiki,
  onChange,
  multiple,
}) => {
  function handleChange(e) {
    onChange(e.target.value);
  }

  return h("fieldset", null, [
    h("legend", null, h("a", { href: WIKI_BASE + wiki }, legend)),
    Object.values(options).map((option) =>
      h("label", { key: option }, [
        h("input", {
          type: multiple ? "checkbox" : "radio",
          name,
          value: option,
          checked: option === value,
          onChange: handleChange,
        }),
        h("span", null, option),
      ])
    ),
  ]);
};

export default InputEnum;
