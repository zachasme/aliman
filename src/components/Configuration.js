import { h } from "https://cdn.skypack.dev/preact";

/**
 * @typedef {object} Configuration - creates a new type named 'SpecialType'
 * @property {string} prop1 - a string property of SpecialType
 * @property {number} prop2 - a number property of SpecialType
 * @property {number=} prop3 - an optional number property of SpecialType
 */

/** @type preact.FunctionComponent<Configuration> */
const Options = (configuration) => {
  return h("p", null, "front");
};

export default Options;
