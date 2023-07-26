/// <mls shortName="switch" project="100541" enhancement="_100541_enhancementLit" groupName="form" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, ifDefined, classMap, live, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { watch } from './_100541_internalWatch';

/**
 * @summary Switches allow the user to toggle an option on or off.
 * @documentation https://shoelace.style/components/switch
 * @status stable
 * @since 2.0
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The control that houses the switch's thumb.
 * @csspart thumb - The switch's thumb.
 * @csspart label - The switch's label.
 *
 * @cssproperty --width - The width of the switch.
 * @cssproperty --height - The height of the switch.
 * @cssproperty --thumb-size - The size of the thumb.
 */
@customElement('switch-100541')
export class Switch extends LitElement {

    @query('input[type="checkbox"]') input: HTMLInputElement;

    @state() private hasFocus = false;
    @property() title = ''; // make reactive to pass through

    @property() label = ''; // the label text for switch

    /** The name of the switch, submitted as a name/value pair with form data. */
    @property() name = '';

    /** The current value of the switch, submitted as a name/value pair with form data. */
    @property() value: string;

    /**
    *  The switch's size.
    * @fieldType { "propertyType":"list", "defaultValue":"medium", "items": ["small" , "medium", "large"]}
    */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /**
    * Disables the switch.
    * @fieldType { "propertyType":"list", "sectionName": "advanced", "items": ["" , "disabled"]}
    */
    @property({ reflect: true }) disabled = false;

    /**
      * Draws the switch in a checked state.
      * @fieldType { "propertyType":"list", "items": ["" , "checked"]}
    */
    @property({ reflect: true }) checked = false;

    /** The default value of the form control. Primarily used for resetting the form control. */
    defaultChecked = false;

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = '';

    /**
      * Makes the switch a required field.
      * @fieldType { "propertyType":"list", "items": ["" , "required"]}
    */
    @property({ reflect: true }) required = false;

    /** Gets the validity state object */
    get validity() {
        return this.input.validity;
    }

    /** Gets the validation message */
    get validationMessage() {
        return this.input.validationMessage;
    }

    private handleBlur() {
        this.hasFocus = false;
    }

    private handleClick() {
        this.checked = !this.checked;
    }

    private handleFocus() {
        this.hasFocus = true;
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.checked = false;
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.checked = true;
        }
    }

    @watch('checked', { waitUntilFirstUpdate: true })
    handleCheckedChange() {
        this.input.checked = this.checked; // force a sync update
    }

    /** Simulates a click on the switch. */
    click() {
        this.input.click();
    }

    /** Sets focus on the switch. */
    focus(options?: FocusOptions) {
        this.input.focus(options);
    }

    /** Removes focus from the switch. */
    blur() {
        this.input.blur();
    }

    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity() {
        return this.input.checkValidity();
    }

    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity() {
        return this.input.reportValidity();
    }

    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string) {
        this.input.setCustomValidity(message);
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
      <label
        part="base"
        class=${classMap({
            switch: true,
            'switch--checked': this.checked,
            'switch--disabled': this.disabled,
            'switch--focused': this.hasFocus,
            'switch--small': this.size === 'small',
            'switch--medium': this.size === 'medium',
            'switch--large': this.size === 'large'
        })}
      >
        <input
          class="switch__input"
          type="checkbox"
          title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
          name=${this.name}
          value=${ifDefined(this.value)}
          .checked=${live(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          role="switch"
          aria-checked=${this.checked ? 'true' : 'false'}
          @click=${this.handleClick}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb"></span>
        </span>

        <label part="label" class="switch__label">${ifDefined(this.label)}</label>
      </label>
    `;

    }
}
