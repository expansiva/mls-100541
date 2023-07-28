/// <mls shortName="radio" project="100541" enhancement="_100541_enhancementLit" groupName="form" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, classMap, ifDefined, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { watch } from './_100541_internalWatch';

@customElement('radio-100541')
export class Radio extends LitElement {
    @query('.button') input: HTMLInputElement;
    @query('.hidden-input') hiddenInput: HTMLInputElement;

    @state() protected hasFocus = false;

    /**
     * @internal The radio button's checked state. This is exposed as an "internal" attribute so we can reflect it, making
     * it easier to style in button groups.
     */
    @property({ type: Boolean, reflect: true }) checked = false;

    /** The radio's value. When selected, the radio group will receive this value. */
    @property() value: string;

    /** Disables the radio button. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /**
     * The radio button's size. When used inside a radio group, the size will be determined by the radio group's size so
     * this attribute can typically be omitted.
     */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Draws a pill-style radio button with rounded edges. */
    @property({ type: Boolean, reflect: true }) pill = false;


    /** text for a radio*/
    @property({ reflect: true }) label = '';

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'presentation');
    }

    private handleBlur() {
        this.hasFocus = false;
    }

    private handleClick(e: MouseEvent) {
        if (this.disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        this.checked = true;
    }

    private handleFocus() {
        this.hasFocus = true;
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }

    /** Sets focus on the radio button. */
    focus(options?: FocusOptions) {
        this.input.focus(options);
    }

    /** Removes focus from the radio button. */
    blur() {
        this.input.blur();
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
      <div part="base" role="presentation">
        <button
          part="${`button${this.checked ? ' button--checked' : ''}`}"
          role="radio"
          aria-checked="${this.checked}"
          class=${classMap({
            button: true,
            'button--default': true,
            'button--small': this.size === 'small',
            'button--medium': this.size === 'medium',
            'button--large': this.size === 'large',
            'button--checked': this.checked,
            'button--disabled': this.disabled,
            'button--focused': this.hasFocus,
            'button--outline': true,
            'button--pill': this.pill,
        })}
          aria-disabled=${this.disabled}
          type="button"
          value=${ifDefined(this.value)}
          tabindex="${this.checked ? '0' : '-1'}"
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @click=${this.handleClick}
        >
          <slot name="prefix" part="prefix" class="button__prefix"></slot>
          <slot part="label" class="button__label">
            <label>${ifDefined(this.label)}</label>
          </slot>
          <slot name="suffix" part="suffix" class="button__suffix"></slot>
        </button>
      </div>
    `;
    }
}
