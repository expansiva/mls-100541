/// <mls shortName="breadcrumb" project="100541" enhancement="_100541_enhancementLit" groupName="menu" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 * @mlsComponentDetails {"webComponentDependencies": ["icon-100541"]}
 */

import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { LocalizeController } from './_100541_internalLocalize';

@customElement('breadcrumb-100541')
export class Breadcrumb extends LitElement {

    private readonly localize = new LocalizeController(this);
    private separatorDir = this.localize.dir();

    @query('slot') defaultSlot: HTMLSlotElement | undefined;
    @query('slot[name="separator"]') separatorSlot: HTMLSlotElement | undefined;

    /**
     * The label to use for the breadcrumb control. This will not be shown on the screen, but it will be announced by
     * screen readers and other assistive devices to provide more context for users.
     */
    @property() label = '';

    // Generates a clone of the separator element to use for each breadcrumb item
    private getSeparator() {
        if (!this.separatorSlot) return;
        const separator = this.separatorSlot.assignedElements({ flatten: true })[0] as HTMLElement;

        // Clone it, remove ids, and slot it
        const clone = separator.cloneNode(true) as HTMLElement;
        [clone, ...(clone as any).querySelectorAll('[id]')].forEach(el => el.removeAttribute('id'));
        clone.setAttribute('data-default', '');
        clone.slot = 'separator';

        return clone;
    }

    private handleSlotChange() {
        if (!this.defaultSlot) return;
        const items = [...this.defaultSlot.assignedElements({ flatten: true })].filter(
            item => item.tagName.toLowerCase() === 'breadcrumb-item-100541'
        ) as any[];

        items.forEach((item, index) => {
            // Append separators to each item if they don't already have one
            const separator = item.querySelector('[slot="separator"]');
            if (separator === null) {
                // No separator exists, add one
                item.append(this.getSeparator());
            } else if (separator.hasAttribute('data-default')) {
                // A default separator exists, replace it
                separator.replaceWith(this.getSeparator());
            } else {
                // The user provided a custom separator, leave it alone
            }

            // The last breadcrumb item is the "current page"
            if (index === items.length - 1) {
                item.setAttribute('aria-current', 'page');
            } else {
                item.removeAttribute('aria-current');
            }
        });
    }

    createRenderRoot() {
        return this;
    }

    render() {
        // We clone the separator and inject them into breadcrumb items, so we need to regenerate the default ones when
        // directionality changes. We do this by storing the current separator direction, waiting for render, then calling
        // the function that regenerates them.
        if (this.separatorDir !== this.localize.dir()) {
            this.separatorDir = this.localize.dir();
            this.updateComplete.then(() => this.handleSlotChange());
        }

        return html`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>
    `;
    }

}

declare global {
  interface HTMLElementTagNameMap {
    'breadcrumb-100541': Breadcrumb;
  }
}