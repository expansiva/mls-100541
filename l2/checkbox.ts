/// <mls shortName="checkbox" project="100541" enhancement="_100541_enhancementLit" groupName="form" />

import { html, classMap, ifDefined, live, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';


@customElement('checkbox-100541')
export default class LitCheckbox extends LitElement {

  @query('input[type="checkbox"]') input: HTMLInputElement;

  @state() private hasFocus = false;

  /**
  * The title value.
  * @fieldType { "propertyType":"string", "sectionName": "optional", "maxLength": "20"}
  */
  @property() title = '';

  /** the label text */
  @property() label = '';

  /** The name of the checkbox, submitted as a name/value pair with form data. */
  @property() name = '';

  /** The current value of the checkbox, submitted as a name/value pair with form data. */
  @property() value: string;

  /**
  * The checkbox's size.
  * @fieldType { "propertyType":"list", "defaultValue":"medium", "items": ["small" , "medium", "large"]}
  */
  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /**
  * Disables the checkbox.
  * @fieldType { "propertyType":"list", "sectionName": "advanced", "items": ["" , "disabled"]}
  */
  @property({ reflect: true }) disabled = false;

  /**
  * Draws the checkbox in a checked state.
  * @fieldType { "propertyType":"list", "items": ["" , "checked"]}
  */
  @property({ reflect: true }) checked = false;

  /**
  * Draws the checkbox in an indeterminate state. This is usually applied to checkboxes that represents a "select
  * all/none" behavior when associated checkboxes have a mix of checked and unchecked states.
  * @fieldType { "propertyType":"list", "items": ["" , "indeterminate"]}
  */
  @property({ reflect: true }) indeterminate = false;

  /** The default value of the form control. Primarily used for resetting the form control. */
  defaultChecked = false;

  /**
   * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
   * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
   * the same document or shadow root for this to work.
   */
  @property({ reflect: true }) form = '';


  /**
  *   Makes the checkbox a required field. 
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

  private handleClick() {
    this.checked = !this.checked;
    this.indeterminate = false;
  }

  private handleBlur() {
    this.hasFocus = false;
  }

  private handleFocus() {
    this.hasFocus = true;
  }


  handleStateChange() {
    this.input.checked = this.checked; // force a sync update
    this.input.indeterminate = this.indeterminate; // force a sync update
  }

  /** Simulates a click on the checkbox. */
  click() {
    this.input.click();
  }

  /** Sets focus on the checkbox. */
  focus(options?: FocusOptions) {
    this.input.focus(options);
  }

  /** Removes focus from the checkbox. */
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

  /**
   * Sets a custom validation message. The value provided will be shown to the user when the form is submitted. To clear
   * the custom validation message, call this method with an empty string.
   */
  setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
  }

  createRenderRoot() {
    return this;
  }

  render() {
    //
    // NOTE: we use a <div> around the label slot because of this Chrome bug.
    //
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1413733
    //
    return html`
      <label
        part="base"
        ${console.info({ disabled: this.disabled })}
        class=${classMap({
      checkbox: true,
      'checkbox--checked': this.checked,
      'checkbox--disabled': this.disabled,
      'checkbox--focused': this.hasFocus,
      'checkbox--indeterminate': this.indeterminate,
      'checkbox--small': this.size === 'small',
      'checkbox--medium': this.size === 'medium',
      'checkbox--large': this.size === 'large'
    })}
      >
        <input
          class="checkbox__input"
          type="checkbox"
          title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
          name=${this.name}
          value=${ifDefined(this.value)}
          .indeterminate=${live(this.indeterminate)}
          .checked=${live(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          aria-checked=${this.checked ? 'true' : 'false'}
          @click=${this.handleClick}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
        />

        <span
          part="control${this.checked ? ' control--checked' : ''}${this.indeterminate ? ' control--indeterminate' : ''}"
          class="checkbox__control"
        >
          ${this.checked
        ? html`
                <svg part="checked-icon svg" class="checkbox__icon" viewBox="0 0 16 16">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                    <g stroke="currentColor" stroke-width="2">
                      <g transform="translate(3.428571, 3.428571)">
                        <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
                        <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              `
        : ''}
          ${!this.checked && this.indeterminate
        ? html`
                <svg part="checked-icon svg" class="checkbox__icon" viewBox="0 0 16 16">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                    <g stroke="currentColor" stroke-width="2">
                      <g transform="translate(3.428571, 3.428571)">
                        <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
                        <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              `
        : ''}
        </span>

        <div part="label" class="checkbox__label">
          ${ifDefined(this.label)}
        </div>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'checkbox-100541': LitCheckbox;
  }
}
