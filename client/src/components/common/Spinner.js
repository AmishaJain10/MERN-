import React from "react";

import spinner from "./spinner.gif";

export default function Spinner() {
  return (
    <div>
      <img
        src={spinner}
        style={{ width: "200px", margin: "auto", display: "board" }}
        alt="Loading.."
      />
    </div>
  );
}
