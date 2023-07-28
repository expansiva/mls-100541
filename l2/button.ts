/// <mls shortName="button" project="100541" enhancement="_100541_enhancementLit" groupName="form" />
/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 * @mlsComponentDetails {"webComponentDependencies": ["icon-button-100541", "spinner-100541"]}
 */

import { html, classMap, ifDefined, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { watch } from './_100541_internalWatch';
import { LocalizeController } from './_100541_internalLocalize';
import { FormControlController, validValidityState } from './_100541_internalForm';

@customElement('button-100541')
export class Button extends LitElement {

    private readonly formControlController = new FormControlController(this, {
        form: input => {
            // Buttons support a form attribute that points to an arbitrary form, so if this attribute is set we need to query
            // the form from the same root using its id
            if (input.hasAttribute('form')) {
                const doc = input.getRootNode() as Document | ShadowRoot;
                const formId = input.getAttribute('form')!;
                return doc.getElementById(formId) as HTMLFormElement; 
            }

            // Fall back to the closest containing form
            return input.closest('form');
        },
        assumeInteractionOn: ['click']
    });


    private readonly localize = new LocalizeController(this);

    @query('.button') button: HTMLButtonElement | HTMLLinkElement;

    @state() private hasFocus = false;
    @state() invalid = false;
    @property() title = ''; // make reactive to pass through

    /** The button's label.*/
    @property() text = '';

    /** The button's theme variant. 
     *  @fieldType { "propertyType":"list", "defaultValue":"default", "items": ["default","primary","success", "neutral", "warning", "danger", "text" ]}
     * 
    */
    @property({ reflect: true }) variant: 'default' | 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text' =
        'default';

    /** The button's size. 
     *  @fieldType { "propertyType":"list", "defaultValue":"medium", "items": ["small","medium","large"]}
    */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Draws the button with a caret. Used to indicate that the button triggers a dropdown menu or similar behavior. */
    @property({ type: Boolean, reflect: true }) caret = false;

    /** Disables the button. 
     *  @fieldType { "propertyType":"list", "items": ["","disabled" ]}
     * 
    */
    @property({ reflect: true }) disabled = false;

    /** Draws the button in a loading state. 
     *  @fieldType { "propertyType":"list", "items": ["","loading" ]}
     * 
    */
    @property({ reflect: true }) loading = false;

    /** Draws an outlined button. 
     *  @fieldType { "propertyType":"list", "items": ["","outline" ]}
     * 
    */
    @property({ reflect: true }) outline = false;

    /** Draws a pill-style button with rounded edges. 
     *  @fieldType { "propertyType":"list", "items": ["","pill" ]}
     * 
    */
    @property({ reflect: true }) pill = false;

    /**
     * Draws a circular icon button. When this attribute is present, the button expects a single `<sl-icon>` in the
     * default slot.
     *  @fieldType { "propertyType":"list", "items": ["","circle" ]}
     * 
     */
    @property({ reflect: true }) circle = false;

    /**
     * The type of button. Note that the default value is `button` instead of `submit`, which is opposite of how native
     * `<button>` elements behave. When the type is `submit`, the button will submit the surrounding form.
     *  @fieldType { "propertyType":"list", "defaultValue":"button", "items": ["button","submit", "reset" ]}
     * 
     */
    @property() type: 'button' | 'submit' | 'reset' = 'button';

    /**
     * The name of the button, submitted as a name/value pair with form data, but only when this button is the submitter.
     * This attribute is ignored when `href` is present.
     */
    @property() name = '';

    /**
     * The value of the button, submitted as a pair with the button's name as part of the form data, but only when this
     * button is the submitter. This attribute is ignored when `href` is present.
     */
    @property() value = '';

    /** When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`. */
    @property() href = '';

    /** Tells the browser where to open the link. Only used when `href` is present. 
     *  @fieldType { "propertyType":"list", "items": ["_blank","_parent", "_self", "_top" ]}
     * 
    */
    @property() target: '_blank' | '_parent' | '_self' | '_top';

    /**
     * When using `href`, this attribute will map to the underlying link's `rel` attribute. Unlike regular links, the
     * default is `noreferrer noopener` to prevent security exploits. However, if you're using `target` to point to a
     * specific tab/window, this will prevent that from working correctly. You can remove or change the default value by
     * setting the attribute to an empty string or a value of your choice, respectively.
     */
    @property() rel = 'noreferrer noopener';

    /** Tells the browser to download the linked file as this filename. Only used when `href` is present. */
    @property() download?: string;

    /**
     * The "form owner" to associate the button with. If omitted, the closest containing form will be used instead. The
     * value of this attribute must be an id of a form in the same document or shadow root as the button.
     */
    @property() form: string;

    /** Used to override the form owner's `action` attribute. */
    @property({ attribute: 'formaction' }) formAction: string;

    /** Used to override the form owner's `enctype` attribute.  
     *  @fieldType { "propertyType":"list", "items": ["application/x-www-form-urlencoded","_parent", "multipart/form-data", "text/plain" ]}
     * 
    */
    @property({ attribute: 'formenctype' })
    formEnctype: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';

    /** Used to override the form owner's `method` attribute.  
     *  @fieldType { "propertyType":"list", "items": ["post","get" ]}
     * 
    */
    @property({ attribute: 'formmethod' }) formMethod: 'post' | 'get';

    /** Used to override the form owner's `novalidate` attribute. */
    @property({ attribute: 'formnovalidate', type: Boolean }) formNoValidate: boolean;

    /** Used to override the form owner's `target` attribute.
     *  @fieldType { "propertyType":"list","items": ["_blank","_parent", "_self", "_top" ] }
     * 
     */
    @property({ attribute: 'formtarget' }) formTarget: '_self' | '_blank' | '_parent' | '_top' | string;

    /** Gets the validity state object */
    get validity() {
        if (this.isButton()) {
            return (this.button as HTMLButtonElement).validity;
        }

        return validValidityState;
    }

    /** Gets the validation message */
    get validationMessage() {
        if (this.isButton()) {
            return (this.button as HTMLButtonElement).validationMessage;
        }

        return '';
    }

    firstUpdated() {
        if (this.isButton()) {
            this.formControlController.updateValidity();
        }
    }

    private handleBlur() {
        this.hasFocus = false;
    }

    private handleFocus() {
        this.hasFocus = true;
    }

    private handleClick() {
        if (this.type === 'submit') {
            this.formControlController.submit(this);
        }

        if (this.type === 'reset') {
            this.formControlController.reset(this);
        }
    }

    private handleInvalid(event: Event) {
        this.formControlController.setValidity(false);
        this.formControlController.emitInvalidEvent(event);
    }

    private isButton() {
        return this.href ? false : true;
    }

    private isLink() {
        return this.href ? true : false;
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        if (this.isButton()) {
            // Disabled form controls are always valid
            this.formControlController.setValidity(this.disabled);
        }
    }

    /** Simulates a click on the button. */
    click() {
        this.button.click();
    }

    /** Sets focus on the button. */
    focus(options?: FocusOptions) {
        this.button.focus(options);
    }

    /** Removes focus from the button. */
    blur() {
        this.button.blur();
    }

    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity() {
        if (this.isButton()) {
            return (this.button as HTMLButtonElement).checkValidity();
        }

        return true;
    }

    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null {
        return this.formControlController.getForm();
    }

    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity() {
        if (this.isButton()) {
            return (this.button as HTMLButtonElement).reportValidity();
        }

        return true;
    }

    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string) {
        if (this.isButton()) {
            (this.button as HTMLButtonElement).setCustomValidity(message);
            this.formControlController.updateValidity();
        }
    }

    createRenderRoot() {
        return this;
    }

    render() {
        const isLink = this.isLink();
        if (isLink) {

            return html`
      <a
        part="base"
        class=${classMap({
                button: true,
                'button--default': this.variant === 'default',
                'button--primary': this.variant === 'primary',
                'button--success': this.variant === 'success',
                'button--neutral': this.variant === 'neutral',
                'button--warning': this.variant === 'warning',
                'button--danger': this.variant === 'danger',
                'button--text': this.variant === 'text',
                'button--small': this.size === 'small',
                'button--medium': this.size === 'medium',
                'button--large': this.size === 'large',
                'button--caret': this.caret,
                'button--circle': this.circle,
                'button--disabled': this.disabled,
                'button--focused': this.hasFocus,
                'button--loading': this.loading,
                'button--standard': !this.outline,
                'button--outline': this.outline,
                'button--pill': this.pill,
                'button--rtl': this.localize.dir() === 'rtl',
                'button--has-label': !!this.text,
                'button--has-prefix': false,
                'button--has-suffix': !!this.caret
            })}
        ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
        type=${ifDefined(isLink ? undefined : this.type)}
        title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
        name=${ifDefined(isLink ? undefined : this.name)}
        value=${ifDefined(isLink ? undefined : this.value)}
        href=${ifDefined(isLink ? this.href : undefined)}
        target=${ifDefined(isLink ? this.target : undefined)}
        download=${ifDefined(isLink ? this.download : undefined)}
        rel=${ifDefined(isLink ? this.rel : undefined)}
        role=${ifDefined(isLink ? undefined : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : '0'}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label">
            <label>${ifDefined(this.text)}</label>
        </slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret ? html`  <icon-100541 part="caret" class="button__caret" library="default" name="caret"></icon-100541> ` : ''
                }
        ${this.loading ? html`<spinner-100541 part="spinner"></spinner-100541>` : ''}
      </a>
    `;
        } else {

            return html`
      <button
        part="base"
        class=${classMap({
                button: true,
                'button--default': this.variant === 'default',
                'button--primary': this.variant === 'primary',
                'button--success': this.variant === 'success',
                'button--neutral': this.variant === 'neutral',
                'button--warning': this.variant === 'warning',
                'button--danger': this.variant === 'danger',
                'button--text': this.variant === 'text',
                'button--small': this.size === 'small',
                'button--medium': this.size === 'medium',
                'button--large': this.size === 'large',
                'button--caret': this.caret,
                'button--circle': this.circle,
                'button--disabled': this.disabled,
                'button--focused': this.hasFocus,
                'button--loading': this.loading,
                'button--standard': !this.outline,
                'button--outline': this.outline,
                'button--pill': this.pill,
                'button--rtl': this.localize.dir() === 'rtl',
                'button--has-label': !!this.text,
                'button--has-prefix': false,
                'button--has-suffix': !!this.caret
            })}
        ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
        type=${ifDefined(isLink ? undefined : this.type)}
        title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
        name=${ifDefined(isLink ? undefined : this.name)}
        value=${ifDefined(isLink ? undefined : this.value)}
        href=${ifDefined(isLink ? this.href : undefined)}
        target=${ifDefined(isLink ? this.target : undefined)}
        download=${ifDefined(isLink ? this.download : undefined)}
        rel=${ifDefined(isLink ? this.rel : undefined)}
        role=${ifDefined(isLink ? undefined : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : '0'}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label">
            <label>${ifDefined(this.text)}</label>
        </slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret ? html` <icon-100541 part="caret" class="button__caret" library="default" name="caret"></icon-100541> ` : ''
                }
        ${this.loading ? html`<spinner-100541 part="spinner"></spinner-100541>` : ''}
      </button>
    `;
        }


    }
}
