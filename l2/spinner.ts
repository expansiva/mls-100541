/// <mls shortName="spinner" project="100541" enhancement="_100541_enhancementLit" groupName="loader" />
				
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('spinner-100541')
export class Spinner extends LitElement {

    /** tamanho do spinner
     * @section principal
     */
    @property({ type: Boolean, converter: String })
    small: 'true' | 'false' = 'false';

    createRenderRoot() {
        return this;
    }

    render() {
    
        const smallClass =  this.small === 'true' ? 'a-spinner--small' : ''
        return html`
        <article class="a-spinner ${smallClass}">
            <div class="a-spinner_container">
            <span
                class="a-spinner_dot a-spinner_dot--1"
            ></span>
            <span
                class="a-spinner_dot a-spinner_dot--2"
            ></span>
            <span
                class="a-spinner_dot a-spinner_dot--3"
            ></span>
            </div>
        </article>
        `;
    }
}
