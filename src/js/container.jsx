import { Container } from "../react/components/Container";
import ReactDOM from "react-dom/client";
import React from "react";
class EsContainer extends HTMLElement {
  constructor(title) {
    super();
    this.title = title;
    this.connectedCallback();
  }
  connectedCallback() {
    const root = ReactDOM.createRoot(this);
    root.render(<Container />);
  }
}
customElements.define("es-container", EsContainer);

new EventSource("/esbuild").addEventListener("change", () => location.reload());
