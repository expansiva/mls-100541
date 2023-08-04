/// <mls shortName="splitPanel" project="100541" enhancement="_100541_enhancementLit" groupName="layout" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';;
import { LocalizeController } from './_100541_internalLocalize';
import { clamp } from './_100541_internalMath';
import { watch } from './_100541_internalWatch';
import { drag } from './_100541_internalDrag';
import ShoaleceElement from './_100541_internalShoelaceElement';


@customElement('split-panel-100541')
export class SplitPanel extends ShoaleceElement {

    private cachedPositionInPixels: number;
    private readonly localize = new LocalizeController(this);
    private resizeObserver: any;
    private size: number;

    @query('.divider') divider: HTMLElement;

    /**
     * The current position of the divider from the primary panel's edge as a percentage 0-100. Defaults to 50% of the
     * container's initial size.
     */
    @property({ type: Number, reflect: true }) position = 50;

    /** The current position of the divider from the primary panel's edge in pixels. */
    @property({ attribute: 'position-in-pixels', type: Number }) positionInPixels: number;

    /** Draws the split panel in a vertical orientation with the start and end panels stacked. */
    @property({ type: Boolean, reflect: true }) vertical = false;

    /** Disables resizing. Note that the position may still change as a result of resizing the host element. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /**
     * If no primary panel is designated, both panels will resize proportionally when the host element is resized. If a
     * primary panel is designated, it will maintain its size and the other panel will grow or shrink as needed when the
     * host element is resized.
     */
    @property() primary?: 'start' | 'end';

    /**
     * One or more space-separated values at which the divider should snap. Values can be in pixels or percentages, e.g.
     * `"100px 50%"`.
     */
    @property() snap?: string;

    /** How close the divider must be to a snap point until snapping occurs. */
    @property({ type: Number, attribute: 'snap-threshold' }) snapThreshold = 12;

    connectedCallback() {
        super.connectedCallback();
        this.resizeObserver = new window['ResizeObserver']((entries: any) => this.handleResize(entries));
        this.updateComplete.then(() => this.resizeObserver.observe(this));

        this.detectSize();
        this.cachedPositionInPixels = this.percentageToPixels(this.position);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.resizeObserver.unobserve(this);
    }

    private detectSize() {
        const { width, height } = this.getBoundingClientRect();
        this.size = this.vertical ? height : width;
    }

    private percentageToPixels(value: number) {
        return this.size * (value / 100);
    }

    private pixelsToPercentage(value: number) {
        return (value / this.size) * 100;
    }

    private handleDrag(event: PointerEvent) {
        const isRtl = this.localize.dir() === 'rtl';

        if (this.disabled) {
            return;
        }

        // Prevent text selection when dragging
        if (event.cancelable) {
            event.preventDefault();
        }

        drag(this, {
            onMove: (x, y) => {
                let newPositionInPixels = this.vertical ? y : x;

                // Flip for end panels
                if (this.primary === 'end') {
                    newPositionInPixels = this.size - newPositionInPixels;
                }

                // Check snap points
                if (this.snap) {
                    const snaps = this.snap.split(' ');

                    snaps.forEach(value => {
                        let snapPoint: number;

                        if (value.endsWith('%')) {
                            snapPoint = this.size * (parseFloat(value) / 100);
                        } else {
                            snapPoint = parseFloat(value);
                        }

                        if (isRtl && !this.vertical) {
                            snapPoint = this.size - snapPoint;
                        }

                        if (
                            newPositionInPixels >= snapPoint - this.snapThreshold &&
                            newPositionInPixels <= snapPoint + this.snapThreshold
                        ) {
                            newPositionInPixels = snapPoint;
                        }
                    });
                }

                this.position = clamp(this.pixelsToPercentage(newPositionInPixels), 0, 100);
            },
            initialEvent: event
        });
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (this.disabled) {
            return;
        }

        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
            let newPosition = this.position;
            const incr = (event.shiftKey ? 10 : 1) * (this.primary === 'end' ? -1 : 1);

            event.preventDefault();

            if ((event.key === 'ArrowLeft' && !this.vertical) || (event.key === 'ArrowUp' && this.vertical)) {
                newPosition -= incr;
            }

            if ((event.key === 'ArrowRight' && !this.vertical) || (event.key === 'ArrowDown' && this.vertical)) {
                newPosition += incr;
            }

            if (event.key === 'Home') {
                newPosition = this.primary === 'end' ? 100 : 0;
            }

            if (event.key === 'End') {
                newPosition = this.primary === 'end' ? 0 : 100;
            }

            this.position = clamp(newPosition, 0, 100);
        }
    }

    private handleResize(entries: any[]) {
        const { width, height } = entries[0].contentRect;
        this.size = this.vertical ? height : width;

        // Resize when a primary panel is set
        if (this.primary) {
            this.position = this.pixelsToPercentage(this.cachedPositionInPixels);
        }
    }

    @watch('position')
    handlePositionChange() {
        this.cachedPositionInPixels = this.percentageToPixels(this.position);
        this.positionInPixels = this.percentageToPixels(this.position);
        this.emit('sl-reposition' as any);
    }

    @watch('positionInPixels')
    handlePositionInPixelsChange() {
        this.position = this.pixelsToPercentage(this.positionInPixels);
    }

    @watch('vertical')
    handleVerticalChange() {
        this.detectSize();
    }

    createRenderRoot() {
        return this;
    }

    render() {
        const gridTemplate = this.vertical ? 'gridTemplateRows' : 'gridTemplateColumns';
        const gridTemplateAlt = this.vertical ? 'gridTemplateColumns' : 'gridTemplateRows';
        const isRtl = this.localize.dir() === 'rtl';
        const primary = `
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `;
        const secondary = 'auto';

        if (this.primary === 'end') {
            if (isRtl && !this.vertical) {
                this.style[gridTemplate] = `${primary} var(--divider-width) ${secondary}`;
            } else {
                this.style[gridTemplate] = `${secondary} var(--divider-width) ${primary}`;
            }
        } else {
            if (isRtl && !this.vertical) {
                this.style[gridTemplate] = `${secondary} var(--divider-width) ${primary}`;
            } else {
                this.style[gridTemplate] = `${primary} var(--divider-width) ${secondary}`;
            }
        }

        // Unset the alt grid template property
        this.style[gridTemplateAlt] = '';

        return html`

            <div
                part="divider"
                class="divider"
                tabindex=${ifDefined(this.disabled ? undefined : '0')}
                role="separator"
                aria-valuenow=${this.position}
                aria-valuemin="0"
                aria-valuemax="100"
                @keydown=${this.handleKeyDown}
                @mousedown=${this.handleDrag}
                @touchstart=${this.handleDrag}
            ></div>
            
    `;
    }

}


declare global {
    interface HTMLElementTagNameMap {
        'split-panel-100541': SplitPanel;
    }
}