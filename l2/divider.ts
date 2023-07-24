/// <mls shortName="divider" project="100541" enhancement="_100541_enhancementLit" groupName="divider" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */
import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @summary Dividers are used to visually separate or group elements.
 * @documentation https://shoelace.style/components/divider
 * @status stable
 * @since 2.0
 * @componentDetails {"dependencies": ["checkbox-100541"]}
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
