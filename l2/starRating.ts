/// <mls shortName="starRating" project="100541" enhancement="_100541_enhancementLit" groupName="rating" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('star-rating-100541')
export class StarRating100541 extends LitElement {

  @property({ type: String, reflect: true })
  private ratingValue = 1

  @property({ type: String, reflect: true })
  private max = 5

  @property({ type: String, reflect: true })
  get legend(){
    try{
      const atr = this.getAttribute('legend');
      return JSON.parse(atr);

    }catch{
      return [];
    }
    
  }
  set legend(v){
    this.setAttribute('legend',v);
    
  }

  createRenderRoot(){
    return this;
  }

  myArrayTot(){
    const array = [];
    if(!this.max) this.max = 5;
    for (let i = 1; i <= this.max; i++) array.push(i);
    return array;
  }

  render() {
    return html`
      <div class="rating-container">
        ${this.myArrayTot().map(
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
      <span class="starratinglegend" style="display:none"></span>
      </div>
    `;
  }

  handleStarClick(starIndex: number) {
    this.ratingValue = starIndex;
  }

  handleStarHover(starIndex: number) {
    for (let i = 1; i <= 5; i++) {
      const starElement = this.renderRoot.querySelector( `.star:nth-child(${i})` ) as HTMLElement;
      const elLegend = this.renderRoot.querySelector('.starratinglegend') as HTMLElement;

      if (i <= starIndex) {
        starElement.style.color = 'orange';
      } else {
        starElement.style.color = '';
      }

      if (!this.legend || this.legend.length === 0 || this.legend.length < (starIndex - 1)) return;
      elLegend.innerText = this.legend[starIndex - 1];
      elLegend.style.display = '';
    }
  }

  handleStarHoverEnd() {
    for (let i = 1; i <= 5; i++) {
      const starElement = this.renderRoot.querySelector(
        `.star:nth-child(${i})`
      ) as HTMLElement;

      const elLegend = this.renderRoot.querySelector('.starratinglegend') as HTMLElement;

      elLegend.innerText = '';
      elLegend.style.display = 'none';

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
