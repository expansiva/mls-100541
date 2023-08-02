/// <mls shortName="breadcrumbItem" project="100541" enhancement="_100541_enhancementLit" groupName="menu" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, ifDefined, classMap, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('breadcrumb-item-100541')
export class BreadcrumbItem extends LitElement {

    /**
    * An optional prefix, usually an icon or icon button.
    */
    @property() prefix: string;

    /**
     *An optional suffix, usually an icon or icon button.
     */
    @property() sufix: string;

    /**
     * Optional URL to direct the user to when the breadcrumb item is activated. When set, a link will be rendered
     * internally. When unset, a button will be rendered instead.
     */
    @property() href?: string;

    /** Tells the browser where to open the link. Only used when `href` is set. */
    @property() target?: '_blank' | '_parent' | '_self' | '_top';

    /** The `rel` attribute to use on the link. Only used when `href` is set. */
    @property() rel = 'noreferrer noopener';

    createRenderRoot() {
        return this;
    }

    render() {
        const isLink = this.href ? true : false;

        return html`
      <div
        part="base"
        class=${classMap({
            'breadcrumb-item': true,
            'breadcrumb-item--has-prefix': !!this.prefix,
            'breadcrumb-item--has-suffix': !!this.sufix,
        })}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

        ${isLink
                ? html`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href!}"
                target="${ifDefined(this.target ? this.target : undefined)}"
                rel=${ifDefined(this.target ? this.rel : undefined)}
              >
                <slot></slot>
              </a>
            `
                : html`
              <button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button">
                <slot></slot>
              </button>
            `}

        <span part="suffix" class="breadcrumb-item__suffix">
          <slot name="suffix"></slot>
        </span>

        <span part="separator" class="breadcrumb-item__separator" aria-hidden="true">
          <slot name="separator"></slot>
        </span>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'breadcrumb-item-100541': BreadcrumbItem;
    }
}