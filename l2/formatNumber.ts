/// <mls shortName="formatNumber" project="100541" enhancement="_100541_enhancementLit" groupName="utilities" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LocalizeController } from './_100541_internalLocalize';

@customElement('format-number-100541')
export class FormatNumber extends LitElement {
    private readonly localize = new LocalizeController(this);

    /** The number to format. */
    @property({ type: Number }) value = 0;

    /** The formatting style to use. 
     *  @fieldType { "propertyType":"list", "defaultValue":"decimal", "items": ["currency","decimal", "percent"] }
    */
    @property() type: 'currency' | 'decimal' | 'percent' = 'decimal';

    /** Turns off grouping separators. */
    @property({ attribute: 'no-grouping', type: Boolean }) noGrouping = false;

    /** The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code to use when formatting. */
    @property() currency = 'USD';

    /** How to display the currency. 
     * @fieldType { "propertyType":"list", "defaultValue":"symbol", "items": ["symbol","narrowSymbol", "code", "name"] }
    */
    @property({ attribute: 'currency-display' }) currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name'  | undefined= 'symbol';

    /** The minimum number of integer digits to use. Possible values are 1-21. 
     * @fieldType { "min": "1", "max": "21" }
    */
    @property({ attribute: 'minimum-integer-digits', type: Number }) minimumIntegerDigits: number | undefined;

    /** The minimum number of fraction digits to use. Possible values are 0-20. 
     * @fieldType { "min": "0", "max": "20" }
    */
    @property({ attribute: 'minimum-fraction-digits', type: Number }) minimumFractionDigits: number | undefined;

    /** The maximum number of fraction digits to use. Possible values are 0-0. */
    @property({ attribute: 'maximum-fraction-digits', type: Number }) maximumFractionDigits: number | undefined;

    /** The minimum number of significant digits to use. Possible values are 1-21. 
     * @fieldType { "min": "1", "max": "21" }
    */
    @property({ attribute: 'minimum-significant-digits', type: Number }) minimumSignificantDigits: number | undefined;

    /** The maximum number of significant digits to use,. Possible values are 1-21. 
     * @fieldType { "min": "1", "max": "21" }
    */
    @property({ attribute: 'maximum-significant-digits', type: Number }) maximumSignificantDigits: number | undefined;

    render() {
        if (isNaN(this.value)) {
            return '';
        }

        return this.localize.number(this.value, {
            style: this.type,
            currency: this.currency,
            currencyDisplay: this.currencyDisplay,
            useGrouping: !this.noGrouping,
            minimumIntegerDigits: this.minimumIntegerDigits,
            minimumFractionDigits: this.minimumFractionDigits,
            maximumFractionDigits: this.maximumFractionDigits,
            minimumSignificantDigits: this.minimumSignificantDigits,
            maximumSignificantDigits: this.maximumSignificantDigits
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'format-number-100541': FormatNumber;
    }
}