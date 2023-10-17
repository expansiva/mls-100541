/// <mls shortName="serviceTeste" project="100541" enhancement="_100541_enhancementLit" groupName="rating" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('service-teste-100541')
export class ServiceTeste extends LitElement {

    
    @property({ type: String, reflect: true })
    private level: mls.events.Level | undefined;

    @property({ type: String, reflect: true })
    public position: 'left' | 'right' | undefined;

    private projectActual = 0;


    // eslint-disable-next-line
    public static details = {
        icon: '&#xf142',//'&#xf142', '&#xf15b'
        name: 'Teste',
        mode: 'A',
        position: 'all',
        readOnly: false,
        tooltip: 'Teste',
        visible: 'A',
        className: '',
        tags: [] as any
    }

    /*createRenderRoot() {
        return this;
    }*/

    render() {

        return html` estou no service teste 3`;
    }

    
}
