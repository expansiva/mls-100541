/// <mls shortName="formatBytes" project="100541" enhancement="_100541_enhancementLit" groupName="utilities" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LocalizeController } from './_100541_internalLocalize';

/**
 * @summary Formats a number as a human readable bytes value.
 * @documentation https://shoelace.style/components/format-bytes
 * @status stable
 * @since 2.0
 */
@customElement('format-bytes-100541')
export class FormatBytes extends LitElement {

    private readonly localize = new LocalizeController(this);

    /** The number to format in bytes. 
     * @fieldType { "defaultValue":"0" }
     * 
    */
    @property({ type: Number }) value = 0;

    /** The type of unit to display. 
     * @fieldType { "propertyType":"list", "defaultValue":"byte", "items": ["byte","bit"] }
    */
    @property() unit: 'byte' | 'bit' = 'byte';

    /** Determines how to display the result, e.g. "100 bytes", "100 b", or "100b". 
     * @fieldType { "propertyType":"list", "defaultValue":"short", "items": ["long","short","narrow"] }
    */
    @property() display: 'long' | 'short' | 'narrow' = 'short';

    render() {
        if (isNaN(this.value)) {
            return '';
        }

        const bitPrefixes = ['', 'kilo', 'mega', 'giga', 'tera']; // petabit isn't a supported unit
        const bytePrefixes = ['', 'kilo', 'mega', 'giga', 'tera', 'peta'];
        const prefix = this.unit === 'bit' ? bitPrefixes : bytePrefixes;
        const index = Math.max(0, Math.min(Math.floor(Math.log10(this.value) / 3), prefix.length - 1));
        const unit = prefix[index] + this.unit;
        const valueToFormat = parseFloat((this.value / Math.pow(1000, index)).toPrecision(3));
        const obj: Intl.NumberFormatOptions = {
            style: 'unit',
            unit,
            unitDisplay: this.display
        } as Intl.NumberFormatOptions

        return this.localize.number(valueToFormat, obj);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'format-bytes-100541': FormatBytes;
    }
}
