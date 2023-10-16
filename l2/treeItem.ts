/// <mls shortName="treeItem" project="100541" enhancement="_100541_enhancementLit" groupName="menu" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 * @mlsComponentDetails {"webComponentDependencies": ["checkbox-100541", "icon-100541"]}
 */

import { html, classMap, live, when, PropertyValueMap, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { watch } from './_100541_internalWatch';
import { animateTo, shimKeyframesHeightAuto, stopAnimations } from './_100541_internalAnimate';
import { getAnimation, setDefaultAnimation } from './_100541_internalAnimationRegistry';
import { LocalizeController } from './_100541_internalLocalize';
import ShoaleceElement from './_100541_internalShoelaceElement';

@customElement('tree-item-100541')
export class TreeItem extends ShoaleceElement {

    static isTreeItem(node: Node) {
        return node instanceof Element && node.getAttribute('role') === 'treeitem';
    }

    private readonly localize = new LocalizeController(this);

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @state() indeterminate = false;
    @state() isLeaf = false;
    @state() loading = false;
    @state() selectable = false;

    /** Expands the tree item. */
    @property({ type: Boolean, reflect: true }) expanded = false;

    /** Draws the tree item in a selected state. */
    @property({ type: Boolean, reflect: true }) selected = false;

    /** Disables the tree item. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** Enables lazy loading behavior. */
    @property({ type: Boolean, reflect: true }) lazy = false;

    @query('slot:not([name])') defaultSlot: HTMLSlotElement | undefined;
    @query('slot[name=children]') childrenSlot: HTMLSlotElement| undefined;
    @query('.tree-item__item') itemElement: HTMLDivElement| undefined;
    @query('.tree-item__children') childrenContainer: HTMLDivElement| undefined;
    @query('.tree-item__expand-button slot') expandButtonSlot: HTMLSlotElement| undefined;

    connectedCallback() {
        super.connectedCallback();

        this.setAttribute('role', 'treeitem');
        this.setAttribute('tabindex', '-1');

        if (this.isNestedItem()) {
            this.slot = 'children';
        }
    }

    firstUpdated() {
        if (!this.childrenContainer) return;
        this.childrenContainer.hidden = !this.expanded;
        this.childrenContainer.style.height = this.expanded ? 'auto' : '0';

        this.isLeaf = !this.lazy && this.getChildrenItems().length === 0;
        this.handleExpandedChange();
    }

    private async animateCollapse() {
        this.emit('sl-collapse' as any);
        if (!this.childrenContainer) return;
        await stopAnimations(this.childrenContainer);

        const { keyframes, options } = getAnimation(this, 'tree-item.collapse', { dir: this.localize.dir() });
        await animateTo(
            this.childrenContainer,
            shimKeyframesHeightAuto(keyframes, this.childrenContainer.scrollHeight),
            options
        );
        this.childrenContainer.hidden = true;

        this.emit('sl-after-collapse' as any);
    }

    // Checks whether the item is nested into an item
    private isNestedItem(): boolean {
        const parent = this.parentElement;
        return !!parent && TreeItem.isTreeItem(parent);
    }

    private handleChildrenSlotChange() {
        this.loading = false;
        this.isLeaf = !this.lazy && this.getChildrenItems().length === 0;
    }

    protected willUpdate(changedProperties: PropertyValueMap<TreeItem> | Map<PropertyKey, unknown>) {
        if (changedProperties.has('selected') && !changedProperties.has('indeterminate')) {
            this.indeterminate = false;
        }
    }

    private async animateExpand() {
        this.emit('sl-expand' as any);
        if (!this.childrenContainer) return;
        await stopAnimations(this.childrenContainer);
        this.childrenContainer.hidden = false;

        const { keyframes, options } = getAnimation(this, 'tree-item.expand', { dir: this.localize.dir() });
        await animateTo(
            this.childrenContainer,
            shimKeyframesHeightAuto(keyframes, this.childrenContainer.scrollHeight),
            options
        );
        this.childrenContainer.style.height = 'auto';

        this.emit('sl-after-expand' as any);
    }

    @watch('loading', { waitUntilFirstUpdate: true })
    handleLoadingChange() {
        this.setAttribute('aria-busy', this.loading ? 'true' : 'false');

        if (!this.loading) {
            this.animateExpand();
        }
    }

    @watch('disabled')
    handleDisabledChange() {
        this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }

    @watch('selected')
    handleSelectedChange() {
        this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    }

    @watch('expanded', { waitUntilFirstUpdate: true })
    handleExpandedChange() {
        if (!this.isLeaf) {
            this.setAttribute('aria-expanded', this.expanded ? 'true' : 'false');
        } else {
            this.removeAttribute('aria-expanded');
        }
    }

    @watch('expanded', { waitUntilFirstUpdate: true })
    handleExpandAnimation() {
        if (this.expanded) {
            if (this.lazy) {
                this.loading = true;

                this.emit('sl-lazy-load' as any);
            } else {
                this.animateExpand();
            }
        } else {
            this.animateCollapse();
        }
    }

    @watch('lazy', { waitUntilFirstUpdate: true })
    handleLazyChange() {
        this.emit('sl-lazy-change' as any);
    }

    /** Gets all the nested tree items in this node. */
    getChildrenItems({ includeDisabled = true }: { includeDisabled?: boolean } = {}): TreeItem[] {
        return this.childrenSlot
            ? ([...this.childrenSlot.assignedElements({ flatten: true })].filter(
                (item: any) => TreeItem.isTreeItem(item) && (includeDisabled || !item.disabled)
            ) as TreeItem[])
            : [];
    }

    render() {
        const isRtl = this.localize.dir() === 'rtl';
        const showExpandButton = !this.loading && (!this.isLeaf || this.lazy);

        return html`
      <div
        part="base"
        class="${classMap({
            'tree-item': true,
            'tree-item--expanded': this.expanded,
            'tree-item--selected': this.selected,
            'tree-item--disabled': this.disabled,
            'tree-item--leaf': this.isLeaf,
            'tree-item--has-expand-button': showExpandButton,
            'tree-item--rtl': this.localize.dir() === 'rtl'
        })}"
      >
        <div
          class="tree-item__item"
          part="
            item
            ${this.disabled ? 'item--disabled' : ''}
            ${this.expanded ? 'item--expanded' : ''}
            ${this.indeterminate ? 'item--indeterminate' : ''}
            ${this.selected ? 'item--selected' : ''}
          "
        >
          <div class="tree-item__indentation" part="indentation"></div>

          <div
            part="expand-button"
            class=${classMap({
            'tree-item__expand-button': true,
            'tree-item__expand-button--visible': showExpandButton
        })}
            aria-hidden="true"
          >
            ${when(this.loading, () => html` <sl-spinner></sl-spinner> `)}
            <slot class="tree-item__expand-icon-slot" name="expand-icon">
              <icon-100541 library="default" name=${isRtl ? 'chevron-left' : 'chevron-right'}></icon-100541>
            </slot>
            <slot class="tree-item__expand-icon-slot" name="collapse-icon">
              <icon-100541 library="default" name=${isRtl ? 'chevron-left' : 'chevron-right'}></icon-100541>
            </slot>
          </div>

          ${when(
            this.selectable,
            () =>
                html`
                <checkbox-100541
                  part="checkbox"
                  exportparts="
                    base:checkbox__base,
                    control:checkbox__control,
                    control--checked:checkbox__control--checked,
                    control--indeterminate:checkbox__control--indeterminate,
                    checked-icon:checkbox__checked-icon,
                    indeterminate-icon:checkbox__indeterminate-icon,
                    label:checkbox__label
                  "
                  class="tree-item__checkbox"
                  ?disabled="${this.disabled}"
                  ?checked="${live(this.selected)}"
                  ?indeterminate="${this.indeterminate}"
                  tabindex="-1"
                ></checkbox-100541>
              `
        )}

          <slot class="tree-item__label" part="label"></slot>
        </div>

        <div class="tree-item__children" part="children" role="group">
          <slot name="children" @slotchange="${this.handleChildrenSlotChange}"></slot>
        </div>
      </div>
    `;
    }
}

setDefaultAnimation('tree-item.expand', {
    keyframes: [
        { height: '0', opacity: '0', overflow: 'hidden' } as any,
        { height: 'auto', opacity: '1', overflow: 'hidden' }
    ],
    options: { duration: 250, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' }
});

setDefaultAnimation('tree-item.collapse', {
    keyframes: [
        { height: 'auto', opacity: '1', overflow: 'hidden' } as any,
        { height: '0', opacity: '0', overflow: 'hidden' }
    ],
    options: { duration: 200, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' }
});

declare global {
    interface HTMLElementTagNameMap {
        'tree-item-100541': TreeItem;
    }
}
