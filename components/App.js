import { h } from "https://cdn.pika.dev/preact";
import Router from "https://cdn.pika.dev/preact-router";

/** @type preact.FunctionComponent */
function Home() {
  return h("p", null, "hej");
}

/** @type preact.FunctionComponent */
const App = () => {
  return h(Router, null, [h(Home, { path: "/" })]);
};

export default App;
