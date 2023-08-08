/// <mls shortName="spinner" project="100541" enhancement="_100541_enhancementLit" groupName="loader" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license. 
 */

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { LocalizeController } from './_100541_internalLocalize';

/**
 * @summary Spinners are used to show the progress of an indeterminate operation.
 * @documentation https://shoelace.style/components/spinner
 * @status stable
 * @since 2.0
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --track-width - The width of the track.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the spinner's indicator.
 * @cssproperty --speed - The time it takes for the spinner to complete one animation cycle.
 */
@customElement('spinner-100541')
export class Spinner extends LitElement {

    createRenderRoot() {
        return this;
    }
    private readonly localize = new LocalizeController(this);

    render() {
        return html`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term('loading')}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
    }
}
