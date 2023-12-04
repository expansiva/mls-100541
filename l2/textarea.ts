/// <mls shortName="textarea" project="100541" enhancement="_100541_enhancementLit" groupName="form" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */
import {
    html,
    classMap,
    ifDefined,
    live,
    LitElement
} from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

@customElement('textarea-100541')
export class SimpleGreeting extends LitElement {

    private resizeObserver:any;

    @query('.textarea__control') input: HTMLTextAreaElement | undefined;

    @state() private hasFocus = false;
    @property() title = ''; // make reactive to pass through

    /** The name of the textarea, submitted as a name/value pair with form data. */
    @property() name = '';

    /** The current value of the textarea, submitted as a name/value pair with form data. */
    @property() value = '';

    /** Draws a filled textarea. */
    @property({ type: Boolean, reflect: true }) filled = false;

    /** The textarea's label. If you need to display HTML, use the `label` slot instead. */
    @property() label = '';

    /** The textarea's help text. If you need to display HTML, use the `help-text` slot instead. */
    @property({ attribute: 'help-text' }) helpText = '';

    /** Placeholder text to show as a hint when the input is empty. */
    @property() placeholder = '';

    /** The number of rows to display by default. */
    @property({ type: Number }) rows = 4;

    /** Controls how the textarea can be resized. */
    @property() resize: 'none' | 'vertical' | 'auto' = 'vertical';

    /** Disables the textarea. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** Makes the textarea readonly. */
    @property({ type: Boolean, reflect: true }) readonly = false;

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = '';

    /** Makes the textarea a required field. */
    @property({ type: Boolean, reflect: true }) required = false;

    /** The minimum length of input that will be considered valid. */
    @property({ type: Number }) minlength: number | undefined;

    /** The maximum length of input that will be considered valid. */
    @property({ type: Number }) maxlength: number | undefined;

    /** Controls whether and how text input is automatically capitalized as it is entered by the user. */
    @property() autocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters' | '' = '';

    /** Indicates whether the browser's autocorrect feature is on or off. */
    @property() autocorrect: string | undefined;

    /**
     * Specifies what permission the browser has to provide assistance in filling out form field values. Refer to
     * [this page on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for available values.
     */
    @property() autocomplete: string | undefined;

    /** Indicates that the input should receive focus on page load. */
    @property({ type: Boolean }) autofocus: boolean = false;

    /** Used to customize the label or icon of the Enter key on virtual keyboards. */
    @property() enterkeyhint: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | '' = '';

    /** Enables spell checking on the textarea. */
    @property({
        type: Boolean,
        converter: {
            // Allow "true|false" attribute values but keep the property boolean
            fromAttribute: value => (!value || value === 'false' ? false : true),
            toAttribute: value => (value ? 'true' : 'false')
        }
    })
    spellcheck = true;

    /**
     * Tells the browser what type of data will be entered by the user, allowing it to display the appropriate virtual
     * keyboard on supportive devices.
     */
    @property() inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' | '' = '';

    /** The default value of the form control. Primarily used for resetting the form control. */
    defaultValue = '';

    /** Gets the validity state object */
    get validity() {
        if(this.input) return this.input.validity;
    }

    /** Gets the validation message */
    get validationMessage() {
        if(this.input) return this.input.validationMessage;
    }

    connectedCallback() {
        super.connectedCallback();
        this.resizeObserver = new window['ResizeObserver'](() => this.setTextareaHeight());

        this.updateComplete.then(() => {
            this.setTextareaHeight();
            this.resizeObserver.observe(this.input);
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.resizeObserver.unobserve(this.input);
    }

    private handleBlur() {
        this.hasFocus = false;
    }

    private handleChange() {
        if (!this.input) return;
        this.value = this.input.value;
        this.setTextareaHeight();
    }

    private handleFocus() {
        this.hasFocus = true;
    }

    private handleInput() {
        if (!this.input) return;
        this.value = this.input.value;
    }

    private setTextareaHeight() {
        if (!this.input) return;
        if (this.resize === 'auto') {
            this.input.style.height = 'auto';
            this.input.style.height = `${this.input.scrollHeight}px`;
        } else {
            (this.input.style.height as string | undefined) = undefined;
        }
    }


    /** Sets focus on the textarea. */
    focus(options?: FocusOptions) {
        if (!this.input) return;
        this.input.focus(options);
    }

    /** Removes focus from the textarea. */
    blur() {
        if (!this.input) return;
        this.input.blur();
    }

    /** Selects all the text in the textarea. */
    select() {
        if (!this.input) return;
        this.input.select();
    }

    /** Gets or sets the textarea's scroll position. */
    scrollPosition(position?: { top?: number; left?: number }): { top: number; left: number } | undefined {
        if (!this.input) return;
        if (position) {
            if (typeof position.top === 'number') this.input.scrollTop = position.top;
            if (typeof position.left === 'number') this.input.scrollLeft = position.left;
            return undefined;
        }

        return {
            top: this.input.scrollTop,
            left: this.input.scrollTop
        };
    }

    /** Sets the start and end positions of the text selection (0-based). */
    setSelectionRange(
        selectionStart: number,
        selectionEnd: number,
        selectionDirection: 'forward' | 'backward' | 'none' = 'none'
    ) {
        if (!this.input) return;
        this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
    }

    /** Replaces a range of text with a new string. */
    setRangeText(
        replacement: string,
        start?: number,
        end?: number,
        selectMode?: 'select' | 'start' | 'end' | 'preserve'
    ) {
        if (!this.input || !start || !end) return;

        this.input.setRangeText(replacement, start, end, selectMode);

        if (this.value !== this.input.value) {
            this.value = this.input.value;
        }

        if (this.value !== this.input.value) {
            this.value = this.input.value;
            this.setTextareaHeight();
        }
    }

    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity() {
        if (!this.input) return;
        return this.input.checkValidity();
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
    }

    createRenderRoot() {
        return this;
    }

    render() {
        const hasLabel = this.label ? true : false;
        const hasHelpText = this.helpText ? true : false;

        return html`
      <div
        part="form-control"
        class=${classMap({
            'form-control': true,
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
            textarea: true,
            'textarea--standard': !this.filled,
            'textarea--filled': this.filled,
            'textarea--disabled': this.disabled,
            'textarea--focused': this.hasFocus,
            'textarea--empty': !this.value,
            'textarea--resize-none': this.resize === 'none',
            'textarea--resize-vertical': this.resize === 'vertical',
            'textarea--resize-auto': this.resize === 'auto'
        })}
          >
            <textarea
              part="textarea"
              id="input"
              class="textarea__control"
              title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
              name=${ifDefined(this.name)}
              .value=${live(this.value)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${ifDefined(this.placeholder)}
              rows=${ifDefined(this.rows)}
              minlength=${ifDefined(this.minlength)}
              maxlength=${ifDefined(this.maxlength)}
              autocapitalize=${ifDefined(this.autocapitalize)}
              autocorrect=${ifDefined(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${ifDefined(this.spellcheck)}
              enterkeyhint=${ifDefined(this.enterkeyhint)}
              inputmode=${ifDefined(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            ></textarea>
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
