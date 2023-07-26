/// <mls shortName="tag" project="100541" enhancement="_100541_enhancementLit" groupName="status" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 * @mlsComponentDetails {"webComponentDependencies": ["icon-button-100541"]}
 */

import { html, classMap, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('tag-100541')
export class Tag extends LitElement {

  /** The tag's theme variant. 
  * @fieldType { "propertyType":"list", "defaultValue":"neutral", "items": ["primary","success","neutral","warning","danger","text"]}
  */
  @property({ reflect: true }) variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text' = 'neutral';

  /** The tag's size. 
   *  @fieldType { "propertyType":"list", "defaultValue":"medium", "items": ["small","medium","large"]}
  */
  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. 
   *  @fieldType { "propertyType":"list", "items": ["","pill"]}
  */
  @property({ reflect: true }) pill = false;

  /** Makes the tag removable and shows a remove button. 
   *  @fieldType { "propertyType":"list", "items": ["","removable"]}
  */
  @property() removable = false;

  /** The tag's text. */
  @property({ type: String, reflect: true }) text = '';

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <span
        part="base"
        class=${classMap({
      tag: true,

      // Types
      'tag--primary': this.variant === 'primary',
      'tag--success': this.variant === 'success',
      'tag--neutral': this.variant === 'neutral',
      'tag--warning': this.variant === 'warning',
      'tag--danger': this.variant === 'danger',
      'tag--text': this.variant === 'text',

      // Sizes
      'tag--small': this.size === 'small',
      'tag--medium': this.size === 'medium',
      'tag--large': this.size === 'large',

      // Modifiers
      'tag--pill': this.pill,
      'tag--removable': this.removable
    })}
      >
        <span class="tag__content">${this.text}</span>

        ${this.removable
      ? html`
              <icon-button-100541 class="style1 tag__remove" exportparts="base:remove-button__base" part="remove-button" name="x-lg" label="Settings"></icon-button-100541>`
        : ''}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tag-100541': Tag;
  }
}
