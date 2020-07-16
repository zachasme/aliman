import { h } from "https://cdn.skypack.dev/preact";
import Router from "https://cdn.skypack.dev/preact-router";
import Auto from "./Auto.js";
import Home from "./Home.js";

/** @type preact.FunctionComponent */
const App = () => {
  return h("div", null, [
    h("div", {}, [
      h("a", { href: "/" }, "front"),
      h("a", { href: "/auto" }, "auto"),
    ]),
    h(Router, { url: "/aliman/" }, [
      h(Auto, { path: "/auto" }),
      h(Home, { default: true }),
    ]),
  ]);
};

export default App;
