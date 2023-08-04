/// <mls shortName="drawer" project="100541" enhancement="_100541_enhancementLit" groupName="modal" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 * @mlsComponentDetails {"webComponentDependencies": ["icon-button-100541"]}
 * 
 */


import { html, ifDefined, classMap } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';;
import { LocalizeController } from './_100541_internalLocalize';
import { animateTo, stopAnimations } from './_100541_internalAnimate';
import { getAnimation, setDefaultAnimation } from './_100541_internalAnimationRegistry';
import { watch } from './_100541_internalWatch';
import { waitForEvent } from './_100541_internalEvent';
import { lockBodyScrolling, unlockBodyScrolling } from './_100541_internalScroll';
import { Modal } from './_100541_internalModal';
import { uppercaseFirstLetter } from './_100541_internalString';
import ShoaleceElement from './_100541_internalShoelaceElement';

@customElement('drawer-100541')
export class Drawer extends ShoaleceElement {

    private readonly localize = new LocalizeController(this);
    private modal = new Modal(this);
    private originalTrigger: HTMLElement | null;

    @query('.drawer') drawer: HTMLElement;
    @query('.drawer__panel') panel: HTMLElement;
    @query('.drawer__overlay') overlay: HTMLElement;

    /** A text content */
    @property({ reflect: true }) content = '';

    /** A footer text content */
    @property({ reflect: true }) footer = '';

    /**
     * Indicates whether or not the drawer is open. You can toggle this attribute to show and hide the drawer, or you can
     * use the `show()` and `hide()` methods and this attribute will reflect the drawer's open state.
     */
    @property({ type: Boolean, reflect: true }) open = false;

    /**
     * The drawer's label as displayed in the header. You should always include a relevant label even when using
     * `no-header`, as it is required for proper accessibility. If you need to display HTML, use the `label` slot instead.
     */
    @property({ reflect: true }) label = '';

    /** The direction from which the drawer will open. */
    @property({ reflect: true }) placement: 'top' | 'end' | 'bottom' | 'start' = 'end';

    /**
     * By default, the drawer slides out of its containing block (usually the viewport). To make the drawer slide out of
     * its parent element, set this attribute and add `position: relative` to the parent.
     */
    @property({ type: Boolean, reflect: true }) contained = false;

    /**
     * Removes the header. This will also remove the default close button, so please ensure you provide an easy,
     * accessible way for users to dismiss the drawer.
     */
    @property({ attribute: 'no-header', type: Boolean, reflect: true }) noHeader = false;

    firstUpdated() {
        this.drawer.hidden = !this.open;

        if (this.open) {
            this.addOpenListeners();

            if (!this.contained) {
                this.modal.activate();
                lockBodyScrolling(this);
            }
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        unlockBodyScrolling(this);
    }

    private requestClose(source: 'close-button' | 'keyboard' | 'overlay') {
        const slRequestClose = this.emit('sl-request-close' as any, {
            cancelable: true,
            detail: { source }
        });

        if (slRequestClose.defaultPrevented) {
            const animation = getAnimation(this, 'drawer.denyClose', { dir: this.localize.dir() });
            animateTo(this.panel, animation.keyframes, animation.options);
            return;
        }

        this.hide();
    }

    private addOpenListeners() {
        document.addEventListener('keydown', this.handleDocumentKeyDown);
    }

    private removeOpenListeners() {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
    }

    private handleDocumentKeyDown = (event: KeyboardEvent) => {
        // Contained drawers aren't modal and don't response to the escape key
        if (this.contained) {
            return;
        }

        if (event.key === 'Escape' && this.modal.isActive() && this.open) {
            event.stopImmediatePropagation();
            this.requestClose('keyboard');
        }
    };

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open) {
            // Show
            this.emit('sl-show' as any);
            this.addOpenListeners();
            this.originalTrigger = document.activeElement as HTMLElement;

            // Lock body scrolling only if the drawer isn't contained
            if (!this.contained) {
                this.modal.activate();
                lockBodyScrolling(this);
            }

            // When the drawer is shown, Safari will attempt to set focus on whatever element has autofocus. This causes the
            // drawer's animation to jitter, so we'll temporarily remove the attribute, call `focus({ preventScroll: true })`
            // ourselves, and add the attribute back afterwards.
            //
            // Related: https://github.com/shoelace-style/shoelace/issues/693
            //
            const autoFocusTarget = this.querySelector('[autofocus]');
            if (autoFocusTarget) {
                autoFocusTarget.removeAttribute('autofocus');
            }

            await Promise.all([stopAnimations(this.drawer), stopAnimations(this.overlay)]);
            this.drawer.hidden = false;

            // Set initial focus
            requestAnimationFrame(() => {
                const slInitialFocus = this.emit('sl-initial-focus' as any, { cancelable: true });

                if (!slInitialFocus.defaultPrevented) {
                    // Set focus to the autofocus target and restore the attribute
                    if (autoFocusTarget) {
                        (autoFocusTarget as HTMLInputElement).focus({ preventScroll: true });
                    } else {
                        this.panel.focus({ preventScroll: true });
                    }
                }

                // Restore the autofocus attribute
                if (autoFocusTarget) {
                    autoFocusTarget.setAttribute('autofocus', '');
                }
            });

            const panelAnimation = getAnimation(this, `drawer.show${uppercaseFirstLetter(this.placement)}`, {
                dir: this.localize.dir()
            });
            const overlayAnimation = getAnimation(this, 'drawer.overlay.show', { dir: this.localize.dir() });
            await Promise.all([
                animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options),
                animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options)
            ]);

            this.emit('sl-after-show' as any);
        } else {
            // Hide
            this.emit('sl-hide' as any);
            this.removeOpenListeners();

            if (!this.contained) {
                this.modal.deactivate();
                unlockBodyScrolling(this);
            }

            await Promise.all([stopAnimations(this.drawer), stopAnimations(this.overlay)]);
            const panelAnimation = getAnimation(this, `drawer.hide${uppercaseFirstLetter(this.placement)}`, {
                dir: this.localize.dir()
            });
            const overlayAnimation = getAnimation(this, 'drawer.overlay.hide', { dir: this.localize.dir() });

            // Animate the overlay and the panel at the same time. Because animation durations might be different, we need to
            // hide each one individually when the animation finishes, otherwise the first one that finishes will reappear
            // unexpectedly. We'll unhide them after all animations have completed.
            await Promise.all([
                animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options).then(() => {
                    this.overlay.hidden = true;
                }),
                animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options).then(() => {
                    this.panel.hidden = true;
                })
            ]);

            this.drawer.hidden = true;

            // Now that the dialog is hidden, restore the overlay and panel for next time
            this.overlay.hidden = false;
            this.panel.hidden = false;

            // Restore focus to the original trigger
            const trigger = this.originalTrigger;
            if (typeof trigger?.focus === 'function') {
                setTimeout(() => trigger.focus());
            }

            this.emit('sl-after-hide' as any);
        }
    }

    @watch('contained', { waitUntilFirstUpdate: true })
    handleNoModalChange() {
        if (this.open && !this.contained) {
            this.modal.activate();
            lockBodyScrolling(this);
        }

        if (this.open && this.contained) {
            this.modal.deactivate();
            unlockBodyScrolling(this);
        }
    }

    /** Shows the drawer. */
    async show() {
        if (this.open) {
            return undefined;
        }

        this.open = true;
        return waitForEvent(this, 'sl-after-show');
    }

    /** Hides the drawer */
    async hide() {
        if (!this.open) {
            return undefined;
        }

        this.open = false;
        return waitForEvent(this, 'sl-after-hide');
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
      <div
        part="base"
        class=${classMap({
            drawer: true,
            'drawer--open': this.open,
            'drawer--top': this.placement === 'top',
            'drawer--end': this.placement === 'end',
            'drawer--bottom': this.placement === 'bottom',
            'drawer--start': this.placement === 'start',
            'drawer--contained': this.contained,
            'drawer--fixed': !this.contained,
            'drawer--rtl': this.localize.dir() === 'rtl',
            'drawer--has-footer': !!this.footer
        })}
      >
        <div part="overlay" class="drawer__overlay" @click=${() => this.requestClose('overlay')} tabindex="-1"></div>
        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? 'false' : 'true'}
          aria-label=${ifDefined(this.noHeader ? this.label : undefined)}
          aria-labelledby=${ifDefined(!this.noHeader ? 'title' : undefined)}
          tabindex="0"
        >
          ${!this.noHeader
                ? html`
                <header part="header" class="drawer__header">
                  <h2 part="title" class="drawer__title" id="title">
                    <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                    <slot name="label"> ${this.label.length > 0 ? this.label : String.fromCharCode(65279)} </slot>
                  </h2>
                  <div part="header-actions" class="drawer__header-actions">
                    <slot name="header-actions"></slot>
                    <icon-button-100541
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="drawer__close"
                      name="x-lg"
                      library="default"
                      @click=${() => this.requestClose('close-button')}
                    ></icon-button-100541>
                  </div>
                </header>
              `
                : ''}

          <slot part="body" class="drawer__body">${this.content}</slot>

          <footer part="footer" class="drawer__footer">
            <slot name="footer">${this.footer}</slot>
          </footer>
        </div>
      </div>
    `;
    }
}


// Top
setDefaultAnimation('drawer.showTop', {
    keyframes: [
        { opacity: 0, translate: '0 -100%' } as any,
        { opacity: 1, translate: '0 0' }
    ],
    options: { duration: 250, easing: 'ease' }
});

setDefaultAnimation('drawer.hideTop', {
    keyframes: [
        { opacity: 1, translate: '0 0' } as any,
        { opacity: 0, translate: '0 -100%' }
    ],
    options: { duration: 250, easing: 'ease' }
});

// End
setDefaultAnimation('drawer.showEnd', {
    keyframes: [
        { opacity: 0, translate: '100%' } as any,
        { opacity: 1, translate: '0' }
    ],
    rtlKeyframes: [
        { opacity: 0, translate: '-100%' } as any,
        { opacity: 1, translate: '0' }
    ],
    options: { duration: 250, easing: 'ease' }
});

setDefaultAnimation('drawer.hideEnd', {
    keyframes: [
        { opacity: 1, translate: '0' } as any,
        { opacity: 0, translate: '100%' }
    ],
    rtlKeyframes: [
        { opacity: 1, translate: '0' } as any,
        { opacity: 0, translate: '-100%' }
    ],
    options: { duration: 250, easing: 'ease' }
});

// Bottom
setDefaultAnimation('drawer.showBottom', {
    keyframes: [
        { opacity: 0, translate: '0 100%' } as any,
        { opacity: 1, translate: '0 0' }
    ],
    options: { duration: 250, easing: 'ease' }
});

setDefaultAnimation('drawer.hideBottom', {
    keyframes: [
        { opacity: 1, translate: '0 0' } as any,
        { opacity: 0, translate: '0 100%' }
    ],
    options: { duration: 250, easing: 'ease' }
});

// Start
setDefaultAnimation('drawer.showStart', {
    keyframes: [
        { opacity: 0, translate: '-100%' } as any,
        { opacity: 1, translate: '0' }
    ],
    rtlKeyframes: [
        { opacity: 0, translate: '100%' } as any,
        { opacity: 1, translate: '0' }
    ],
    options: { duration: 250, easing: 'ease' }
});

setDefaultAnimation('drawer.hideStart', {
    keyframes: [
        { opacity: 1, translate: '0' } as any,
        { opacity: 0, translate: '-100%' }
    ],
    rtlKeyframes: [
        { opacity: 1, translate: '0' } as any,
        { opacity: 0, translate: '100%' }
    ],
    options: { duration: 250, easing: 'ease' }
});

// Deny close
setDefaultAnimation('drawer.denyClose', {
    keyframes: [{ scale: 1 } as any, { scale: 1.01 }, { scale: 1 }],
    options: { duration: 250 }
});

// Overlay
setDefaultAnimation('drawer.overlay.show', {
    keyframes: [{ opacity: 0 } as any, { opacity: 1 }],
    options: { duration: 250 }
});

setDefaultAnimation('drawer.overlay.hide', {
    keyframes: [{ opacity: 1 } as any, { opacity: 0 }],
    options: { duration: 250 }
});

declare global {
    interface HTMLElementTagNameMap {
        'drawer-100541': Drawer;
    }
}