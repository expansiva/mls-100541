/// <mls shortName="aTestePereira" project="100541" enhancement="_100541_enhancementLit" groupName="test" />
/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 * @mlsComponentDetails {"webComponentDependencies": ["icon-100541"]}
 */

import { html, css, LitElement, repeat, live } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

@customElement('a-teste-pereira-100541')
export class SimpleGreeting extends LitElement {

    @state()
    items: Set<IItem> = new Set([
        { name: "Justin" },
        { name: "Steve" },
        { name: "Kevin" },
        { name: "Russell" },
        { name: "Liz" },
        { name: "Peter" },
    ])

    @state()
    lastUser: string = ''

    @state()
    list: Set<string> = new Set([]);

    @query('#inpAdd')
    input: HTMLInputElement


    add() {
        let item = { id: this.items.size, name: this.input.value };
        this.items.add(item);
        this.requestUpdate();
    };

    delet(item: IItem) {
        this.items.delete(item);
        this.requestUpdate();

    };


    _clickHandler(e: Event) {
        const target = e.target as HTMLInputElement;
        const name = target.getAttribute('name');
        this.lastUser = name;

        if (target.checked) this.list.add(name);
        else this.list.delete(name);
        this.list = new Set(this.list);

    }

    render() {

        return html` 
            <h3>Teste Pagina ${this.lastUser}</h3> 
            <input id="inpAdd"></input>
            <button @click=${() => this.add()}>Adicionar</button>                
            <ul>
                ${repeat(Array.from(this.items), (item: IItem, index: number) => html`
                <li>${index}: 
                    <label>
                        <input type="checkbox" name="${item.name}" @click=${this._clickHandler}>${item.name}
                    </label>
                      <icon-100541
                        @click=${() => this.delet(item)}
                        class="icon-button__icon"
                        name="x-circle-fill"
                        library="default"
                        aria-hidden="true"
                        ></icon-100541>
                </li>`)}
            </ul><hr>


            <span> O ultimo clicado foi: ${this.lastUser} </span>
            <hr>
            <span>Selecionados: ${Array.from(this.list).join(',')} </span>

        `;
    }


}

interface IItem {
    name: string
}


