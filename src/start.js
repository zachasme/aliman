import "https://cdn.pika.dev/preact/debug";
import { h, render } from "https://cdn.pika.dev/preact";
import App from "./components/App.js";
import firebase from "./firebase.js";

firebase.auth().signInAnonymously();

const container = document.getElementById("root");
render(h(App, null, "hej"), container);
