/// <mls shortName="details" project="100541" enhancement="_100541_enhancementLit" groupName="menu" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 * @mlsComponentDetails {"webComponentDependencies": ["icon-100541"]}
 */

import { html, classMap, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { watch } from './_100541_internalWatch';
import { animateTo, shimKeyframesHeightAuto, stopAnimations } from './_100541_internalAnimate';
import { getAnimation, setDefaultAnimation } from './_100541_internalAnimationRegistry';
import { LocalizeController } from './_100541_internalLocalize';
import { waitForEvent } from './_100541_internalEvent';
import ShoaleceElement from './_100541_internalShoelaceElement';

@customElement('details-100541')
export class Details extends ShoaleceElement {

    private readonly localize = new LocalizeController(this);

    @query('.details') details: HTMLDetailsElement;
    @query('.details__header') header: HTMLElement;
    @query('.details__body') body: HTMLElement;
    @query('.details__expand-icon-slot') expandIconSlot: HTMLSlotElement;

    detailsObserver: MutationObserver;

    /**
     * Indicates whether or not the details is open. You can toggle this attribute to show and hide the details, or you
     * can use the `show()` and `hide()` methods and this attribute will reflect the details' open state.
      * @fieldType { "propertyType":"list", "defaultValue":"", "items": ["","open"]} 
     * 
     */
    @property({ reflect: true }) open = false;

    /** The summary to show in the header. If you need to display HTML, use the `summary` slot instead. */
    @property() summary: string;

    /** The text of details. */
    @property({ reflect: true }) text: string;

    /** Disables the details so it can't be toggled. 
      * @fieldType { "propertyType":"list", "defaultValue":"", "items": ["","disabled"]} 
    */
    @property({  reflect: true }) disabled = false;

    firstUpdated() {
        this.body.style.height = this.open ? 'auto' : '0';
        if (this.open) {
            this.details.open = true;
        }

        this.detailsObserver = new MutationObserver(changes => {
            for (const change of changes) {
                if (change.type === 'attributes' && change.attributeName === 'open') {
                    if (this.details.open) {
                        this.show();
                    } else {
                        this.hide();
                    }
                }
            }
        });
        this.detailsObserver.observe(this.details, { attributes: true });
    }

    disconnectedCallback() {
        this.detailsObserver.disconnect();
    }

    private handleSummaryClick(ev: MouseEvent) {
        ev.preventDefault();
        if (!this.disabled) {
            if (this.open) {
                this.hide();
            } else {
                this.show();
            }

            this.header.focus();
        }
    }

    private handleSummaryKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();

            if (this.open) {
                this.hide();
            } else {
                this.show();
            }
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            event.preventDefault();
            this.hide();
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            event.preventDefault();
            this.show();
        }
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open) {
            this.details.open = true;
            // Show
            const slShow = this.emit('sl-show' as any, { cancelable: true });
            if (slShow.defaultPrevented) {
                this.open = false;
                this.details.open = false;
                return;
            }

            await stopAnimations(this.body);

            const { keyframes, options } = getAnimation(this, 'details.show', { dir: this.localize.dir() });
            await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
            this.body.style.height = 'auto';

            this.emit('sl-after-show' as any);
        } else {
            // Hide
            const slHide = this.emit('sl-hide' as any, { cancelable: true });
            if (slHide.defaultPrevented) {
                this.details.open = true;
                this.open = true;
                return;
            }

            await stopAnimations(this.body);

            const { keyframes, options } = getAnimation(this, 'details.hide', { dir: this.localize.dir() });
            await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
            this.body.style.height = 'auto';

            this.details.open = false;
            this.emit('sl-after-hide' as any);
        }
    }

    /** Shows the details. */
    async show() {
        if (this.open || this.disabled) {
            return undefined;
        }

        this.open = true;
        return waitForEvent(this, 'sl-after-show');
    }

    /** Hides the details */
    async hide() {
        if (!this.open || this.disabled) {
            return undefined;
        }

        this.open = false;
        return waitForEvent(this, 'sl-after-hide');
    }

    createRenderRoot() {
        return this;
    }

    render() {
        const isRtl = this.localize.dir() === 'rtl';

        return html`
      <details
        part="base"
        class=${classMap({
            details: true,
            'details--open': this.open,
            'details--disabled': this.disabled,
            'details--rtl': isRtl
        })}
      >
        <summary
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="content"
          aria-disabled=${this.disabled ? 'true' : 'false'}
          tabindex=${this.disabled ? '-1' : '0'}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <slot name="summary" part="summary" class="details__summary">${this.summary}</slot>

          <span part="summary-icon" class="details__summary-icon">
            <slot name="expand-icon">
              <icon-100541 library="default" name=${isRtl ? 'chevron-left' : 'chevron-right'}></icon-100541>
            </slot>
            <slot name="collapse-icon">
              <icon-100541 library="default" name=${isRtl ? 'chevron-left' : 'chevron-right'}></icon-100541>
            </slot>
          </span>
        </summary>

        <div class="details__body" role="region" aria-labelledby="header">
          <slot part="content" id="content" class="details__content">${this.text}</slot>
        </div>
      </details>
    `;
    }
}

setDefaultAnimation('details.show', {
    keyframes: [
        { height: '0', opacity: '0' } as any,
        { height: 'auto', opacity: '1' }
    ],
    options: { duration: 250, easing: 'linear' }
});

setDefaultAnimation('details.hide', {
    keyframes: [
        { height: 'auto', opacity: '1' } as any,
        { height: '0', opacity: '0' }
    ],
    options: { duration: 250, easing: 'linear' }
});

declare global {
    interface HTMLElementTagNameMap {
        'details-100541': Details;
    }
}