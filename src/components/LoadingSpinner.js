import {createElement} from "npm:react";
import {createRoot} from "npm:react-dom/client";

export function LoadingSpinner({label = "Loading"}) {
  return createElement("div", {className: "loading-spinner", role: "status", "aria-label": label},
    createElement("span", {className: "loading-spinner__indicator", "aria-hidden": "true"})
  );
}

export function renderLoadingSpinner(options = {}) {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(createElement(LoadingSpinner, options));
  container.dispose = () => root.unmount();
  return container;
}
