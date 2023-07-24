/// <mls shortName="countDown" project="100541" enhancement="_100541_enhancementLit" groupName="loader" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('count-down-100541')
export class CountDown100541 extends LitElement {

  /**
   * teste
   * @fieldType { "type":"number", "max": "10", "min":"2"}
   */
  @property({ type: Number, reflect: true })
  timer = 10;

  private elFill;

  private isFinished = true;

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="circle">
        <div class="circle-fill"></div>
        <div class="countdown">${this.startCountdown()}</div>
      </div>
    `;
  }

  startCountdown() {

    if (!this.isFinished) return this.timer;

    setTimeout(() => {
      this.elFill = this.querySelector('.circle-fill');
      this.elFill.style.animation = 'fillAnimation ' + this.timer + 's linear forwards';
      const intervalId = setInterval(() => {

        if (this.timer === 0) {
          clearInterval(intervalId);
          this.elFill.style.clip = 'rect(0px, 200px, 200px, 0px)';
          this.elFill.style.background = 'red';
          this.elFill.style.animation = '';
          this.isFinished = true;
        } else {
          this.timer--;
          this.elFill.style.clip = '';
          this.elFill.style.background = '';
          this.isFinished = false;
        }
      }, 1000);

    }, 500);
    return this.timer

  }

}
