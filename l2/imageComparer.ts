/// <mls shortName="imageComparer" project="100541" enhancement="_100541_enhancementLit" groupName="midia" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, classMap, styleMap, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

/**
 * @summary Compare visual differences between similar photos with a sliding panel.
 * @documentation https://shoelace.style/components/image-comparer
 * @status stable
 * @since 2.0
 *
 * @csspart base - The component's base wrapper.
 * @csspart before - The container that wraps the before image.
 * @csspart after - The container that wraps the after image.
 * @csspart divider - The divider that separates the images.
 * @csspart handle - The handle that the user drags to expose the after image.
 *
 * @cssproperty --divider-width - The width of the dividing line.
 * @cssproperty --handle-size - The size of the compare handle.
 * @componentDetails {"dependencies": ["icon-100541"]}
 */
@customElement('image-comparer-100541')
export class ImageComparer extends LitElement {
    @query('.image-comparer') base: HTMLElement;
    @query('.image-comparer__handle') handle: HTMLElement;

    /**
     *  The position of the divider as a percentage.
     * @fieldType { "type":"number", "defaultValue":"50" "max": "100", "min":"0"}
     */
    @property({ type: Number, reflect: true }) position = 50;

    /** The path to the image before to load. */
    @property() srcBefore: string;

    /** The path to the image after to load. */
    @property() srcAfter: string;

    private clamp(value: number, min: number, max: number) {
        const noNegativeZero = (n: number) => (Object.is(n, -0) ? 0 : n);
        if (value < min) return noNegativeZero(min);
        if (value > max) return noNegativeZero(max);
        return noNegativeZero(value);
    }

    private drag(container: HTMLElement, options?: any) {
        function move(pointerEvent: PointerEvent) {
            const dims = container.getBoundingClientRect();
            const defaultView = container.ownerDocument.defaultView!;
            const offsetX = dims.left + defaultView.pageXOffset;
            const offsetY = dims.top + defaultView.pageYOffset;
            const x = pointerEvent.pageX - offsetX;
            const y = pointerEvent.pageY - offsetY;

            if (options?.onMove) {
                options.onMove(x, y);
            }
        }

        function stop() {
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', stop);

            if (options?.onStop) {
                options.onStop();
            }
        }

        document.addEventListener('pointermove', move, { passive: true });
        document.addEventListener('pointerup', stop);

        // If an initial event is set, trigger the first drag immediately
        if (options?.initialEvent instanceof PointerEvent) {
            move(options.initialEvent);
        }
    }

    private handleDrag(event: PointerEvent) {
        const { width } = this.base.getBoundingClientRect();
        const isRtl = true; //this.localize.dir() === 'rtl';

        event.preventDefault();

        this.drag(this.base, {
            onMove: x => {
                this.position = parseFloat(this.clamp((x / width) * 100, 0, 100).toFixed(2));
                if (isRtl) this.position = 100 - this.position;
            },
            initialEvent: event
        });
    }

    private handleKeyDown(event: KeyboardEvent) {
        const isLtr = true; // this.localize.dir() === 'ltr';
        const isRtl = true;//  this.localize.dir() === 'rtl';

        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            const incr = event.shiftKey ? 10 : 1;
            let newPosition = this.position;

            event.preventDefault();

            if ((isLtr && event.key === 'ArrowLeft') || (isRtl && event.key === 'ArrowRight')) {
                newPosition -= incr;
            }
            if ((isLtr && event.key === 'ArrowRight') || (isRtl && event.key === 'ArrowLeft')) {
                newPosition += incr;
            }
            if (event.key === 'Home') {
                newPosition = 0;
            }
            if (event.key === 'End') {
                newPosition = 100;
            }
            newPosition = this.clamp(newPosition, 0, 100);

            this.position = newPosition;
        }
    }

    static watch = (propertyName: string | string[], options?: any) => {
        const resolvedOptions: Required<any> = {
            waitUntilFirstUpdate: false,
            ...options
        };
        return <ElemClass extends LitElement>(proto: ElemClass, decoratedFnName: any) => {
            // @ts-expect-error - update is a protected property
            const { update } = proto;
            const watchedProperties = Array.isArray(propertyName) ? propertyName : [propertyName];

            // @ts-expect-error - update is a protected property
            proto.update = function (this: ElemClass, changedProps: Map<keyof ElemClass, ElemClass[keyof ElemClass]>) {
                watchedProperties.forEach(property => {
                    const key = property as keyof ElemClass;
                    if (changedProps.has(key)) {
                        const oldValue = changedProps.get(key);
                        const newValue = this[key];

                        if (oldValue !== newValue) {
                            if (!resolvedOptions.waitUntilFirstUpdate || this.hasUpdated) {
                                (this[decoratedFnName] as unknown as any)(oldValue, newValue);
                            }
                        }
                    }
                });

                update.call(this, changedProps);
            };
        };
    }

    createRenderRoot() {
        return this;
    }

    @ImageComparer.watch('position', { waitUntilFirstUpdate: true })
    render() {
        const isRtl = true; // this.localize.dir() === 'rtl';

        return html`
      <div
        part="base"
        id="image-comparer"
        class=${classMap({
            'image-comparer': true,
            'image-comparer--rtl': isRtl
        })}
        @keydown=${this.handleKeyDown}
      >
        <div class="image-comparer__image">
          <div part="before" class="image-comparer__before">
            <img src="${this.srcBefore}"></img>
          </div>

          <div
            part="after"
            class="image-comparer__after"
            style=${styleMap({
            clipPath: isRtl ? `inset(0 0 0 ${100 - this.position}%)` : `inset(0 ${100 - this.position}% 0 0)`
        })}
          >
            <img src="${this.srcAfter}"></img>
          </div>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${styleMap({
            left: isRtl ? `${100 - this.position}%` : `${this.position}%`
        })}
          @mousedown=${this.handleDrag}
          @touchstart=${this.handleDrag}
        >
          <div
            part="handle"
            class="image-comparer__handle"
            role="scrollbar"
            aria-valuenow=${this.position}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-controls="image-comparer"
            tabindex="0"
          >
        <icon-100541 library="default" name="grip-vertical"></icon-100541>
          </div>
        </div>
      </div>
    `;
    }
}

declare global {
  interface HTMLElementTagNameMap {
    'image-comparer-100541': ImageComparer;
  }
}
