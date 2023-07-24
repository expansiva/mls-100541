/// <mls shortName="progressBar" project="100541" enhancement="_100541_enhancementLit" groupName="loader" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, ifDefined, classMap, styleMap, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @summary Progress bars are used to show the status of an ongoing operation.
 * @documentation https://shoelace.style/components/progress-bar
 * @status stable
 * @since 2.0
 *
 * @slot - A label to show inside the progress indicator.
 *
 * @csspart base - The component's base wrapper.
 * @csspart indicator - The progress bar's indicator.
 * @csspart label - The progress bar's label.
 *
 * @cssproperty --height - The progress bar's height.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the indicator.
 * @cssproperty --label-color - The color of the label.
 */
@customElement('progress-bar-100541')
export class ProgressBar extends LitElement {

    /** The current progress as a percentage, 0 to 100. 
    * @fieldType { "propertyType":"number", "min":"0", "max": "100", "defaultValue": "0"}
    */
    @property({ type: Number, reflect: true }) value = 0;

    /** When true, percentage is ignored, the label is hidden, and the progress bar is drawn in an indeterminate state. 
    * @fieldType { "propertyType":"list", "items": ["" , "indeterminate"]}
    */
    @property({ type: Boolean, reflect: true }) indeterminate = false;

    /** A custom label for assistive devices. */
    @property() label = '';

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
      <div
        part="base"
        class=${classMap({
            'progress-bar': true,
            'progress-bar--indeterminate': this.indeterminate,
            'progress-bar--rtl': true
        })}
        role="progressbar"
        title=${ifDefined(this.title)}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${this.indeterminate ? 0 : this.value}
      >
        <div part="indicator" class="progress-bar__indicator" style=${styleMap({ width: `${this.value}%` })}>
          ${!this.indeterminate ? html` <slot part="label" class="progress-bar__label"></slot> ` : ''}
        </div>
      </div>
    `;
    }
}
