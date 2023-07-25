/// <mls shortName="animatedImage" project="100541" enhancement="_100541_enhancementLit" groupName="midia" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
/**
 * @summary A component for displaying animated GIFs and WEBPs that play and pause on interaction.
 * @documentation https://shoelace.style/components/animated-image
 * @status stable
 * @since 2.0
 *
 * @part - control-box - The container that surrounds the pause/play icons and provides their background.
 *
 * @cssproperty --control-box-size - The size of the icon box.
 * @cssproperty --icon-size - The size of the play/pause icons.
 */

@customElement('animated-image-100541')
export class AnimatedImage extends LitElement {
    @query('.animated-image__animated') animatedImage: HTMLImageElement;

    @state() frozenFrame: string;
    @state() isLoaded = false;

    /** The path to the image to load. */
    @property() src: string;

    /** A description of the image used by assistive devices. */
    @property() alt: string;

    /** Plays the animation. When this attribute is remove, the animation will pause. */
    @property({ type: Boolean, reflect: true }) play: boolean;

    private handleClick() {
        this.play = !this.play;
    }

    private handleLoad() {
        const canvas = document.createElement('canvas');
        const { width, height } = this.animatedImage;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(this.animatedImage, 0, 0, width, height);
        this.frozenFrame = canvas.toDataURL('image/gif');

        if (!this.isLoaded) {
            this.isLoaded = true;
        }
    }

    handleSrcChange() {
        this.isLoaded = false;
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
      <div class="animated-image">
        <img
          class="animated-image__animated"
          src=${this.src}
          alt=${this.alt}
          crossorigin="anonymous"
          aria-hidden=${this.play ? 'false' : 'true'}
          @click=${this.handleClick}
          @load=${this.handleLoad}
        />

        ${this.isLoaded
                ? html`
              <img
                class="animated-image__frozen"
                src=${this.frozenFrame}
                alt=${this.alt}
                aria-hidden=${this.play ? 'true' : 'false'}
                @click=${this.handleClick}
              />

              <div part="control-box" class="animated-image__control-box">
                <svg name='play-icon' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16" part="svg">
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                </svg>
                <svg name='pause-icon' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16" part="svg">
                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
                </svg>
              </div>
            `
                : ''}
      </div>
    `;
    }
}

declare global {
  interface HTMLElementTagNameMap {
    'animated-image-100541': AnimatedImage;
  }
}
