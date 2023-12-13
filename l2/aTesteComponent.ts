/// <mls shortName="aTesteComponent" project="100541" enhancement="_100541_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('a-teste-component-100541')
export class SimpleGreeting extends LitElement {
    static styles = css`p { color: green }`;

    @property()
    name: string = 'Somebodys';

    render() {
        return html`<p> Hello, ${this.name} !</p>`;
    }
}

