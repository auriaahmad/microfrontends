import React from "react";
import ReactDOM from "react-dom/client";
import SyncedCounter from "./SyncedCounter";
import UnsyncedCounter from "./UnsyncedCounter";

const App = () => (
  <div>
    <h1>Remote App Running</h1>
    <SyncedCounter />
    <br />
    <UnsyncedCounter />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);