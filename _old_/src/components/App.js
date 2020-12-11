import { h } from "https://cdn.pika.dev/preact";
import { useEffect, useState } from "https://cdn.pika.dev/preact/hooks";
import Router, { Link } from "https://cdn.pika.dev/preact-router";

import firebase from "../firebase.js";

import Auto from "./Auto.js";
import Home from "./Home.js";

/** @type preact.FunctionComponent */
const App = () => {
  const [user, setUser] = useState(firebase.auth().currentUser);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);

  if (!user) return h("p", null, "wait");

  return h("div", null, [
    h("div", {}, [
      h("a", { href: "/" }, "front"),
      h(Link, { href: "/auto" }, "auto"),
    ]),
    h(Router, null, [
      h(Auto, { key: 1, path: "/auto", user }),
      h(Home, { key: 2, default: true, user }),
    ]),
  ]);
};

export default App;
