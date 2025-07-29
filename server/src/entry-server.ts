import React from "react";
import { renderToString } from "react-dom/server";
import App from "../../client/src/App";
import { StaticRouter } from "react-router-dom/server";

export function render(url: string) {
  return renderToString(
    <Router>
      <App />
    </Router>
  );
}

