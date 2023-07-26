/// <mls shortName="iconButton" project="100541" enhancement="_100541_enhancementLit" groupName="icon" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 * @mlsComponentDetails {"webComponentDependencies": ["icon-100541"]}
 */

import { html, ifDefined, classMap, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('icon-button-100541')
export class IconButton extends LitElement {

  @query('.icon-button') button: HTMLButtonElement | HTMLLinkElement;

  @state() private hasFocus = false;

  /** The name of the icon to draw. Available names depend on the icon library being used. */
  @property() name?: string;


  /** The name of a registered custom icon library. */
  @property() library?: string;

  /**
   * An external URL of an SVG file. Be sure you trust the content you are including, as it will be executed as code and
   * can result in XSS attacks.
   */
  @property() src?: string;

  /** When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`. */
  @property() href?: string;

  /** Tells the browser where to open the link. Only used when `href` is set. */
  @property() target?: '_blank' | '_parent' | '_self' | '_top';

  /** Tells the browser to download the linked file as this filename. Only used when `href` is set. */
  @property() download?: string;

  /**
   * A description that gets read by assistive devices. For optimal accessibility, you should always include a label
   * that describes what the icon button does.
   */
  @property() label = '';

  /** Disables the button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  private handleBlur() {
    this.hasFocus = false;
  }

  private handleFocus() {
    this.hasFocus = true;
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /** Simulates a click on the icon button. */
  click() {
    this.button.click();
  }

  /** Sets focus on the icon button. */
  focus(options?: FocusOptions) {
    this.button.focus(options);
  }

  /** Removes focus from the icon button. */
  blur() {
    this.button.blur();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const isLink = this.href ? true : false;
    if (isLink) {
      return html`
      <a
        part="base"
        class=${classMap({
        'icon-button': true,
        'icon-button--disabled': !isLink && this.disabled,
        'icon-button--focused': this.hasFocus
      })}
        ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
        type=${ifDefined(isLink ? undefined : 'button')}
        href=${ifDefined(isLink ? this.href : undefined)}
        target=${ifDefined(isLink ? this.target : undefined)}
        download=${ifDefined(isLink ? this.download : undefined)}
        rel=${ifDefined(isLink && this.target ? 'noreferrer noopener' : undefined)}
        role=${ifDefined(isLink ? undefined : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label="${this.label}"
        tabindex=${this.disabled ? '-1' : '0'}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <icon-100541
          class="icon-button__icon"
          name=${ifDefined(this.name)}
          library=${ifDefined(this.library)}
          src=${ifDefined(this.src)}
          aria-hidden="true"
        ></icon-100541>
      </a>
    `;
    } else {
      return html`
      <button
        part="base"
        class=${classMap({
        'icon-button': true,
        'icon-button--disabled': !isLink && this.disabled,
        'icon-button--focused': this.hasFocus
      })}
        ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
        type=${ifDefined(isLink ? undefined : 'button')}
        href=${ifDefined(isLink ? this.href : undefined)}
        target=${ifDefined(isLink ? this.target : undefined)}
        download=${ifDefined(isLink ? this.download : undefined)}
        rel=${ifDefined(isLink && this.target ? 'noreferrer noopener' : undefined)}
        role=${ifDefined(isLink ? undefined : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label="${this.label}"
        tabindex=${this.disabled ? '-1' : '0'}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <icon-100541
          class="icon-button__icon"
          name=${ifDefined(this.name)}
          library=${ifDefined(this.library)}
          src=${ifDefined(this.src)}
          aria-hidden="true"
        ></icon-100541>
      </button>
    `;
    }


  }
}

declare global {
  interface HTMLElementTagNameMap {
    'icon-button-100541': IconButton;
  }
}