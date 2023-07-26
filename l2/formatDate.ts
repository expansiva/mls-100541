/// <mls shortName="formatDate" project="100541" enhancement="_100541_enhancementLit" groupName="utilities" />
/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LocalizeController } from './_100541_internalLocalize';

/**
 * @summary Formats a date/time using the specified locale and options.
 * @documentation https://shoelace.style/components/format-date
 * @status stable
 * @since 2.0
 */
@customElement('format-date-100541')
export class FormatDate extends LitElement {
    private readonly localize = new LocalizeController(this);

    /**
     * The date/time to format. If not set, the current date and time will be used. When passing a string, it's strongly
     * recommended to use the ISO 8601 format to ensure timezones are handled correctly. To convert a date to this format
     * in JavaScript, use [`date.toISOString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString).
     */
    @property() date: Date | string = new Date();

    /** The format for displaying the weekday. 
    *  @fieldType { "propertyType":"list", "items": ["narrow","short","long"] }
    */
    @property() weekday: 'narrow' | 'short' | 'long';

    /** The format for displaying the era.
     *  @fieldType { "propertyType":"list", "items": ["narrow","short","long"] }
     */
    @property() era: 'narrow' | 'short' | 'long';

    /** The format for displaying the year. 
     * @fieldType { "propertyType":"list", "items": ["numeric","2-digit"] }
    */
    @property() year: 'numeric' | '2-digit';

    /** The format for displaying the month. 
     * @fieldType { "propertyType":"list", "items": ["numeric","2-digit","narrow","short","long"] }
    */
    @property() month: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';

    /** The format for displaying the day. 
     * @fieldType { "propertyType":"list", "items": ["numeric","2-digit"] }
    */
    @property() day: 'numeric' | '2-digit';

    /** The format for displaying the hour. 
     * @fieldType { "propertyType":"list", "items": ["numeric","2-digit"] }
    */
    @property() hour: 'numeric' | '2-digit';

    /** The format for displaying the minute. 
     * @fieldType { "propertyType":"list", "items": ["numeric","2-digit"] }
    */
    @property() minute: 'numeric' | '2-digit';

    /** The format for displaying the second. 
     * @fieldType { "propertyType":"list", "items": ["numeric","2-digit"] }
    */
    @property() second: 'numeric' | '2-digit';

    /** The format for displaying the time. 
     * @fieldType { "propertyType":"list", "items": ["short","long"] }
    */
    @property({ attribute: 'time-zone-name' }) timeZoneName: 'short' | 'long';

    /** The time zone to express the time in. */
    @property({ attribute: 'time-zone' }) timeZone: string;

    /** The format for displaying the hour. 
     * @fieldType { "propertyType":"list", "defaultValue": "auto", "items": ["auto","12","24"] }
    */
    @property({ attribute: 'hour-format' }) hourFormat: 'auto' | '12' | '24' = 'auto';

    createRenderRoot() {
        return this;
    }

    render() {
        const date = new Date(this.date);
        const hour12 = this.hourFormat === 'auto' ? undefined : this.hourFormat === '12';

        // Check for an invalid date
        if (isNaN(date.getMilliseconds())) {
            return undefined;
        }

        return html`
      <time datetime=${date.toISOString()}>
        ${this.localize.date(date, {
            weekday: this.weekday,
            era: this.era,
            year: this.year,
            month: this.month,
            day: this.day,
            hour: this.hour,
            minute: this.minute,
            second: this.second,
            timeZoneName: this.timeZoneName,
            timeZone: this.timeZone,
            hour12: hour12
        })}
      </time>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'format-date-100541': FormatDate;
    }
}