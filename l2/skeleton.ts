/// <mls shortName="skeleton" project="100541" enhancement="_100541_enhancementLit" groupName="loader" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, classMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';;
import ShoaleceElement from './_100541_internalShoelaceElement';

@customElement('skeleton-100541')
export class Skeleton extends ShoaleceElement {

    /** Determines which effect the skeleton will use. */
    @property() effect: 'pulse' | 'sheen' | 'none' = 'none';

    render() {
        return html`
      <div
        part="base"
        class=${classMap({
            skeleton: true,
            'skeleton--pulse': this.effect === 'pulse',
            'skeleton--sheen': this.effect === 'sheen'
        })}
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'skeleton-100541': Skeleton;
    }
}