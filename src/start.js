import { h, render } from "https://cdn.skypack.dev/preact";
import App from "./components/App.js";
import firebase from "./firebase.js";

const container = document.getElementById("root");
render(h(App, null, "hej"), container);
