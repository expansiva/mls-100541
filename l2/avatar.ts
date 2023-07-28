/// <mls shortName="avatar" project="100541" enhancement="_100541_enhancementLit" groupName="avatar" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 * @mlsComponentDetails {"webComponentDependencies": ["icon-100541"] }
 */

import { html, classMap, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { watch } from './_100541_internalWatch';

/**
 * @summary Avatars are used to represent a person or object.
 * @documentation https://shoelace.style/components/avatar
 * @status stable
 * @since 2.0
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the avatar's icon.
 * @csspart initials - The container that wraps the avatar's initials.
 * @csspart image - The avatar image. Only shown when the `image` attribute is set.
 *
 * @cssproperty --size - The size of the avatar.
 */
@customElement('avatar-100541')
export class Avatar extends LitElement {
  @state() private hasError = false;

  /** The image source to use for the avatar. */
  @property() image = '';

  /** A label to use to describe the avatar to assistive devices. */
  @property() label = '';

  /** A custom icon */
  @property({ reflect: true }) icon = '';

  /**
  * Initials to use as a fallback when no image is available (1-2 characters max recommended).
  * @fieldType { "propertyType":"string", "defaultValue":"", "maxLenght": "2"}
  */
  @property() initials = '';

  /**
  * Indicates how the browser should load the image.
  * @fieldType { "propertyType":"list", "defaultValue":"eager", "items": ["eager" , "lazy"]}
  */
  @property() loading: 'eager' | 'lazy' = 'eager';

  /**
  * The shape of the avatar.
  * @fieldType { "propertyType":"list", "defaultValue":"circle", "items": ["circle" , "square", "rounded"]}
  */
  @property({ reflect: true }) shape: 'circle' | 'square' | 'rounded' = 'circle';

  @watch('image')
  handleImageChange() {
    // Reset the error when a new image is provided
    this.hasError = false;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const avatarWithImage = html`
      <img
        part="image"
        class="avatar__image"
        src="${this.image}"
        loading="${this.loading}"
        alt=""
        @error="${() => (this.hasError = true)}"
      />
    `;

    let avatarWithoutImage = html``;

    if (this.initials) {
      avatarWithoutImage = html`<div part="initials" class="avatar__initials">${this.initials}</div>`;
    } else {
      avatarWithoutImage = html`
        <div part="icon" class="avatar__icon" aria-hidden="true">
            <icon-100541 name="${this.icon || 'person-fill'}" library="default"></icon-100541>
        </div>
      `;
    }

    return html`
      <div
        part="base"
        class=${classMap({
      avatar: true,
      'avatar--circle': this.shape === 'circle',
      'avatar--rounded': this.shape === 'rounded',
      'avatar--square': this.shape === 'square'
    })}
        role="img"
        aria-label=${this.label}
      >
        ${this.image && !this.hasError ? avatarWithImage : avatarWithoutImage}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'avatar-100541': Avatar;
  }
}
