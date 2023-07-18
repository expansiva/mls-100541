/// <mls shortName="starRating" project="100541" enhancement="_100541_enhancementLit" groupName="rating" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('star-rating-100541')
export class SimpleGreeting extends LitElement {

  @property({ type: String, reflect: true })
  private ratingValue = 1

  createRenderRoot(){
    return this;
  }

  render() {
    return html`
      <div class="rating-container">
        ${[1, 2, 3, 4, 5].map(
      (index) => html`
            <span
              class="star"
              @click=${() => this.handleStarClick(index)}
              @mouseover=${() => this.handleStarHover(index)}
              @mouseout=${() => this.handleStarHoverEnd()}
              style="color:${this.getStarColor(index)}"
            >
              &#9733;
            </span>
          `
    )}
      </div>
    `;
  }

  handleStarClick(starIndex: number) {
    this.ratingValue = starIndex;
  }

  handleStarHover(starIndex: number) {
    for (let i = 1; i <= 5; i++) {
      const starElement = this.renderRoot.querySelector(
        `.star:nth-child(${i})`
      ) as HTMLElement;
      if (i <= starIndex) {
        starElement.style.color = 'orange';
      } else {
        starElement.style.color = '';
      }
    }
  }

  handleStarHoverEnd() {
    for (let i = 1; i <= 5; i++) {
      const starElement = this.renderRoot.querySelector(
        `.star:nth-child(${i})`
      ) as HTMLElement;
      if (i <= this.ratingValue) {
        starElement.style.color = 'orange';
      } else {
        starElement.style.color = '';
      }
    }
  }

  getStarColor(starIndex: number) {
    return starIndex <= this.ratingValue ? 'orange' : '';
  }
}
