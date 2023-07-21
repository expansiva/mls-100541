/// <mls shortName="divider" project="100541" enhancement="_100541_enhancementLit" groupName="divider" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';


/**
 * @summary Dividers are used to visually separate or group elements.
 * @documentation https://shoelace.style/components/divider
 * @status stable
 * @since 2.0
 *
 * @cssproperty --color - The color of the divider.
 * @cssproperty --width - The width of the divider.
 * @cssproperty --spacing - The spacing of the divider.
 */

@customElement('divider-100541')
export default class Divider extends LitElement {


    /**
    * Draws the divider in a vertical orientation.
    * @fieldType { "propertyType":"boolean"}
    */
    @property({ reflect: true }) vertical = 'false';

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'separator');
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'divider-100541': Divider;
    }
}
