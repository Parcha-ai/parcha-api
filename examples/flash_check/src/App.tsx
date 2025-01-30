import React from "react";
import { FlashLoader } from "./components/FlashLoader";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Parcha Flash Loader</h1>
      <p className="description">
        Upload a PDF document to verify its authenticity using Parcha's Flash
        Loader API.
      </p>
      <FlashLoader />
    </div>
  );
}

export default App;
