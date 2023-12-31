/// <mls shortName="range" project="100541" enhancement="_100541_enhancementLit" groupName="form" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, ifDefined, live, classMap, LitElement } from 'lit';
import { customElement, property, query, state, eventOptions } from 'lit/decorators.js';
import { watch } from './_100541_internalWatch';
import { defaultValue } from './_100541_internalDefaultValue';
import { FormControlController } from './_100541_internalForm';

@customElement('range-100541')
export class Range extends LitElement {

    private readonly formControlController = new FormControlController(this);
    private resizeObserver: any;

    @query('.range__control') input: HTMLInputElement   | undefined;
    @query('.range__tooltip') output: HTMLOutputElement | null   | undefined;

    @state() private hasFocus = false;
    @state() private hasTooltip = false;
    @property() title = ''; // make reactive to pass through

    /** The name of the range, submitted as a name/value pair with form data. */
    @property() name = '';

    /** The current value of the range, submitted as a name/value pair with form data. */
    @property({ type: Number }) value = 0;

    /** The range's label. If you need to display HTML, use the `label` slot instead. */
    @property() label = '';

    /** The range's help text. If you need to display HTML, use the help-text slot instead. */
    @property({ attribute: 'help-text' }) helpText = '';

    /** Disables the range. 
     *  @fieldType { "propertyType":"list", "items": ["","disabled"]}
    */
    @property({ reflect: true }) disabled = false;

    /** The minimum acceptable value of the range. */
    @property({ type: Number }) min = 0;

    /** The maximum acceptable value of the range. */
    @property({ type: Number }) max = 100;

    /** The interval at which the range will increase and decrease. */
    @property({ type: Number }) step = 1;

    /** The preferred placement of the range's tooltip. 
     *  @fieldType { "propertyType":"list", "defaultValue":"top", "items": ["top","bottom","none"]}
    */
    @property() tooltip: 'top' | 'bottom' | 'none' = 'top';

    /**
     * A function used to format the tooltip's value. The range's value is passed as the first and only argument. The
     * function should return a string to display in the tooltip.
     */
    @property({ attribute: false }) tooltipFormatter: (value: number) => string = (value: number) => value.toString();

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = '';

    /** The default value of the form control. Primarily used for resetting the form control. */
    @defaultValue() defaultValue = 0;

    /** Gets the validity state object */
    get validity() {
        if (!this.input) return;
        return this.input.validity;
    }

    /** Gets the validation message */
    get validationMessage() {
        if (!this.input) return;
        return this.input.validationMessage;
    }

    connectedCallback() {
        super.connectedCallback();
        this.resizeObserver = new window['ResizeObserver'](() => this.syncRange());

        if (this.value < this.min) {
            this.value = this.min;
        }
        if (this.value > this.max) {
            this.value = this.max;
        }

        this.updateComplete.then(() => {
            this.syncRange();
            this.resizeObserver.observe(this.input);
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.resizeObserver.unobserve(this.input);
    }


    private handleInput() {
        if (!this.input) return;
        this.value = parseFloat(this.input.value);
        this.syncRange();
    }

    private handleBlur() {
        this.hasFocus = false;
        this.hasTooltip = false;
    }

    private handleFocus() {
        this.hasFocus = true;
        this.hasTooltip = true;
    }

    @eventOptions({ passive: true })
    private handleThumbDragStart() {
        this.hasTooltip = true;
    }

    private handleThumbDragEnd() {
        this.hasTooltip = false;
    }

    private syncProgress(percent: number) {
        if (!this.input) return;
        this.input.style.setProperty('--percent', `${percent * 100}%`);
    }

    private syncTooltip(percent: number) {
        if (!this.input || !this.output) return;
        if (this.output !== null) {
            const inputWidth = this.input.offsetWidth;
            const tooltipWidth = this.output.offsetWidth;
            const thumbSize = getComputedStyle(this.input).getPropertyValue('--thumb-size');
            const isRtl = false;
            const percentAsWidth = inputWidth * percent;

            // The calculations are used to "guess" where the thumb is located. Since we're using the native range control
            // under the hood, we don't have access to the thumb's true coordinates. These measurements can be a pixel or two
            // off depending on the size of the control, thumb, and tooltip dimensions.
            if (isRtl) {
                const x = `${inputWidth - percentAsWidth}px + ${percent} * ${thumbSize}`;
                this.output.style.translate = `calc((${x} - ${tooltipWidth / 2}px - ${thumbSize} / 2))`;
            } else {
                const x = `${percentAsWidth}px - ${percent} * ${thumbSize}`;
                this.output.style.translate = `calc(${x} - ${tooltipWidth / 2}px + ${thumbSize} / 2)`;
            }
        }
    }

    @watch('value', { waitUntilFirstUpdate: true })
    handleValueChange() {
        this.formControlController.updateValidity();
        if (!this.input) return;
        // The value may have constraints, so we set the native control's value and sync it back to ensure it adhere's to
        // min, max, and step properly
        this.input.value = this.value.toString();
        this.value = parseFloat(this.input.value);

        this.syncRange();
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        // Disabled form controls are always valid
        this.formControlController.setValidity(this.disabled);
    }

    @watch('hasTooltip', { waitUntilFirstUpdate: true })
    syncRange() {
        const percent = Math.max(0, (this.value - this.min) / (this.max - this.min));

        this.syncProgress(percent);

        if (this.tooltip !== 'none') {
            this.syncTooltip(percent);
        }
    }

    private handleInvalid(event: Event) {
        this.formControlController.setValidity(false);
        this.formControlController.emitInvalidEvent(event);
    }

    /** Sets focus on the range. */
    focus(options?: FocusOptions) {
        if (!this.input) return;
        this.input.focus(options);
    }

    /** Removes focus from the range. */
    blur() {
        if (!this.input) return;
        this.input.blur();
    }

    /** Increments the value of the range by the value of the step attribute. */
    stepUp() {
        if (!this.input) return;
        this.input.stepUp();
        if (this.value !== Number(this.input.value)) {
            this.value = Number(this.input.value);
        }
    }

    /** Decrements the value of the range by the value of the step attribute. */
    stepDown() {
        if (!this.input) return;
        this.input.stepDown();
        if (this.value !== Number(this.input.value)) {
            this.value = Number(this.input.value);
        }
    }

    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity() {
        if (!this.input) return;
        return this.input.checkValidity();
    }

    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null {
        return this.formControlController.getForm();
    }

    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity() {
        if (!this.input) return;
        return this.input.reportValidity();
    }

    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string) {
        if (!this.input) return;
        this.input.setCustomValidity(message);
        this.formControlController.updateValidity();
    }

    createRenderRoot() {
        return this;
    }

    render() {

        const hasLabel = !!this.label
        const hasHelpText = !!this.helpText
        // NOTE - always bind value after min/max, otherwise it will be clamped
        return html`
      <div
        part="form-control"
        class=${classMap({
            'form-control': true,
            'form-control--medium': true, // range only has one size
            'form-control--has-label': hasLabel,
            'form-control--has-help-text': hasHelpText
        })}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${hasLabel ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${classMap({
            range: true,
            'range--disabled': this.disabled,
            'range--focused': this.hasFocus,
            'range--tooltip-visible': this.hasTooltip,
            'range--tooltip-top': this.tooltip === 'top',
            'range--tooltip-bottom': this.tooltip === 'bottom'
        })}
            @mousedown=${this.handleThumbDragStart}
            @mouseup=${this.handleThumbDragEnd}
            @touchstart=${this.handleThumbDragStart}
            @touchend=${this.handleThumbDragEnd}
          >
            <input
              part="input"
              id="input"
              class="range__control"
              title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
              type="range"
              name=${ifDefined(this.name)}
              ?disabled=${this.disabled}
              min=${ifDefined(this.min)}
              max=${ifDefined(this.max)}
              step=${ifDefined(this.step)}
              .value=${live(this.value.toString())}
              aria-describedby="help-text"
              @focus=${this.handleFocus}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @blur=${this.handleBlur}
            />
            ${this.tooltip !== 'none' && !this.disabled
                ? html`
                  <output part="tooltip" class="range__tooltip">
                    ${typeof this.tooltipFormatter === 'function' ? this.tooltipFormatter(this.value) : this.value}
                  </output>
                `
                : ''}
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${hasHelpText ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
    }
}
