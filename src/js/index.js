class EsHeader extends HTMLElement {
    constructor() {
        super();
    }
}
customElements.define("es-header", EsHeader);


new EventSource('/esbuild').addEventListener('change', () => location.reload())