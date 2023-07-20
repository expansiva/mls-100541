/// <mls shortName="badge" project="100541" enhancement="_100541_enhancementLit" groupName="status" />

import { customElement, property } from 'lit/decorators.js';
import { html, LitElement, classMap } from 'lit';

@customElement('badge-100541')
export default class Badge extends LitElement {

  /**
  * The badge's theme variant.
  * @fieldType { "propertyType":"list", "items": ["primary" , "success" , "warning" , "danger"]}
  */
  @property({ reflect: true }) variant: 'primary' | 'success' | 'warning' | 'danger' = 'primary';

  /** Draws a pill-style badge with rounded edges. */
  @property({ type: Boolean, reflect: true }) pill = false;

  /** Makes the badge pulsate to draw attention. */
  @property({ type: Boolean, reflect: true }) pulse = false;

  /** The badge's text. */
  @property({ type: String, reflect: true }) text = '';

  createRenderRoot() {
    return this;
  }

  render() {

    return html`
      <span
        part="base"
        class=${classMap({
      badge: true,
      'badge--primary': this.variant === 'primary',
      'badge--success': this.variant === 'success',
      'badge--warning': this.variant === 'warning',
      'badge--danger': this.variant === 'danger',
      'badge--pill': this.pill,
      'badge--pulse': this.pulse
    })}
        role="status"
      >
      ${this.text}
      </span>
    `;
  }
}
