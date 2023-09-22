/// <mls shortName="tree" project="100541" enhancement="_100541_enhancementLit" groupName="menu" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { watch } from './_100541_internalWatch';
import { clamp } from './_100541_internalMath';
import { LocalizeController } from './_100541_internalLocalize';
import { TreeItem } from './_100541_treeItem';
import ShoaleceElement from './_100541_internalShoelaceElement';

function syncCheckboxes(changedTreeItem: TreeItem, initialSync = false) {
    function syncParentItem(treeItem: TreeItem) {
        const children = treeItem.getChildrenItems({ includeDisabled: false });

        if (children.length) {
            const allChecked = children.every(item => item.selected);
            const allUnchecked = children.every(item => !item.selected && !item.indeterminate);

            treeItem.selected = allChecked;
            treeItem.indeterminate = !allChecked && !allUnchecked;
        }
    }

    function syncAncestors(treeItem: TreeItem) {
        const parentItem: TreeItem | null = treeItem.parentElement as TreeItem;

        if (TreeItem.isTreeItem(parentItem)) {
            syncParentItem(parentItem);
            syncAncestors(parentItem);
        }
    }

    function syncDescendants(treeItem: TreeItem) {
        for (const childItem of treeItem.getChildrenItems()) {
            childItem.selected = initialSync
                ? treeItem.selected || childItem.selected
                : !childItem.disabled && treeItem.selected;

            syncDescendants(childItem);
        }

        if (initialSync) {
            syncParentItem(treeItem);
        }
    }

    syncDescendants(changedTreeItem);
    syncAncestors(changedTreeItem);
}


@customElement('tree-100541')
export class Tree extends ShoaleceElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @query('slot:not([name])') defaultSlot: HTMLSlotElement;
    @query('slot[name=expand-icon]') expandedIconSlot: HTMLSlotElement;
    @query('slot[name=collapse-icon]') collapsedIconSlot: HTMLSlotElement;

    /**
     * The selection behavior of the tree. Single selection allows only one node to be selected at a time. Multiple
     * displays checkboxes and allows more than one node to be selected. Leaf allows only leaf nodes to be selected.
     */
    @property() selection: 'single' | 'multiple' | 'leaf' = 'single';

    //
    // A collection of all the items in the tree, in the order they appear. The collection is live, meaning it is
    // automatically updated when the underlying document is changed.
    //
    private lastFocusedItem: TreeItem | null;
    private readonly localize = new LocalizeController(this);
    private mutationObserver: MutationObserver;
    private clickTarget: TreeItem | null = null;

    constructor() {
        super();
        this.addEventListener('focusin', this.handleFocusIn as any);
        this.addEventListener('focusout', this.handleFocusOut as any);
        this.addEventListener('sl-lazy-change', this.handleSlotChange);
    }

    async connectedCallback() {
        super.connectedCallback();

        this.setAttribute('role', 'tree');
        this.setAttribute('tabindex', '0');

        await this.updateComplete;

        this.mutationObserver = new MutationObserver(this.handleTreeChanged);
        this.mutationObserver.observe(this, { childList: true, subtree: true });
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this.mutationObserver.disconnect();
    }

    // Generates a clone of the expand icon element to use for each tree item
    private getExpandButtonIcon(status: 'expand' | 'collapse') {
        const slot = status === 'expand' ? this.expandedIconSlot : this.collapsedIconSlot;
        const icon = slot.assignedElements({ flatten: true })[0] as HTMLElement;

        // Clone it, remove ids, and slot it
        if (icon) {
            const clone = icon.cloneNode(true) as HTMLElement;
            [clone, ...clone.querySelectorAll('[id]') as any].forEach(el => el.removeAttribute('id'));
            clone.setAttribute('data-default', '');
            clone.slot = `${status}-icon`;

            return clone;
        }

        return null;
    }

    // Initializes new items by setting the `selectable` property and the expanded/collapsed icons if any
    private initTreeItem = (item: TreeItem) => {
        item.selectable = this.selection === 'multiple';

        ['expand', 'collapse']
            .filter(status => !!this.querySelector(`[slot="${status}-icon"]`))
            .forEach((status: any) => {
                const existingIcon = item.querySelector(`[slot="${status}-icon"]`);

                if (existingIcon === null) {
                    // No separator exists, add one
                    item.append(this.getExpandButtonIcon(status)!);
                } else if (existingIcon.hasAttribute('data-default')) {
                    // A default separator exists, replace it
                    existingIcon.replaceWith(this.getExpandButtonIcon(status)!);
                } else {
                    // The user provided a custom icon, leave it alone
                }
            });
    };

    private handleTreeChanged = (mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
            const addedNodes: TreeItem[] = [...mutation.addedNodes as any].filter(TreeItem.isTreeItem) as TreeItem[];
            const removedNodes = [...mutation.removedNodes as any].filter(TreeItem.isTreeItem) as TreeItem[];

            addedNodes.forEach(this.initTreeItem);

            if (this.lastFocusedItem && removedNodes.includes(this.lastFocusedItem)) {
                this.lastFocusedItem = null;
            }
        }
    };

    private selectItem(selectedItem: TreeItem) {
        const previousSelection = [...this.selectedItems];

        if (this.selection === 'multiple') {
            selectedItem.selected = !selectedItem.selected;
            if (selectedItem.lazy) {
                selectedItem.expanded = true;
            }
            syncCheckboxes(selectedItem);
        } else if (this.selection === 'single' || selectedItem.isLeaf) {
            const items = this.getAllTreeItems();
            for (const item of items) {
                item.selected = item === selectedItem;
            }
        } else if (this.selection === 'leaf') {
            selectedItem.expanded = !selectedItem.expanded;
        }

        const nextSelection = this.selectedItems;

        if (
            previousSelection.length !== nextSelection.length ||
            nextSelection.some(item => !previousSelection.includes(item))
        ) {
            // Wait for the tree items' DOM to update before emitting
            Promise.all(nextSelection.map(el => el.updateComplete)).then(() => {
                this.emit('sl-selection-change' as any, { detail: { selection: nextSelection } });
            });
        }
    }

    private getAllTreeItems() {
        return [...this.querySelectorAll<TreeItem>('tree-item-100541') as any];
    }

    private focusItem(item?: TreeItem | null) {
        item?.focus();
    }

    private handleKeyDown(event: KeyboardEvent) {
        // Ignore key presses we aren't interested in
        if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
            return;
        }

        // Ignore key presses when focus is inside a text field. This prevents the component from hijacking nested form
        // controls that exist inside tree items.
        if (event.composedPath().some((el: any) => ['input', 'textarea'].includes(el?.tagName?.toLowerCase()))) {
            return;
        }

        const items = this.getFocusableItems();
        const isLtr = this.localize.dir() === 'ltr';
        const isRtl = this.localize.dir() === 'rtl';

        if (items.length > 0) {
            event.preventDefault();
            const activeItemIndex = items.findIndex(item => item.matches(':focus'));
            const activeItem: TreeItem | undefined = items[activeItemIndex];

            const focusItemAt = (index: number) => {
                const item = items[clamp(index, 0, items.length - 1)];
                this.focusItem(item);
            };
            const toggleExpand = (expanded: boolean) => {
                activeItem.expanded = expanded;
            };

            if (event.key === 'ArrowDown') {
                // Moves focus to the next node that is focusable without opening or closing a node.
                focusItemAt(activeItemIndex + 1);
            } else if (event.key === 'ArrowUp') {
                // Moves focus to the next node that is focusable without opening or closing a node.
                focusItemAt(activeItemIndex - 1);
            } else if ((isLtr && event.key === 'ArrowRight') || (isRtl && event.key === 'ArrowLeft')) {
                //
                // When focus is on a closed node, opens the node; focus does not move.
                // When focus is on a open node, moves focus to the first child node.
                // When focus is on an end node (a tree item with no children), does nothing.
                //
                if (!activeItem || activeItem.disabled || activeItem.expanded || (activeItem.isLeaf && !activeItem.lazy)) {
                    focusItemAt(activeItemIndex + 1);
                } else {
                    toggleExpand(true);
                }
            } else if ((isLtr && event.key === 'ArrowLeft') || (isRtl && event.key === 'ArrowRight')) {
                //
                // When focus is on an open node, closes the node.
                // When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.
                // When focus is on a closed `tree`, does nothing.
                //
                if (!activeItem || activeItem.disabled || activeItem.isLeaf || !activeItem.expanded) {
                    focusItemAt(activeItemIndex - 1);
                } else {
                    toggleExpand(false);
                }
            } else if (event.key === 'Home') {
                // Moves focus to the first node in the tree without opening or closing a node.
                focusItemAt(0);
            } else if (event.key === 'End') {
                // Moves focus to the last node in the tree that is focusable without opening the node.
                focusItemAt(items.length - 1);
            } else if (event.key === 'Enter' || event.key === ' ') {
                // Selects the focused node.
                if (!activeItem.disabled) {
                    this.selectItem(activeItem);
                }
            }
        }
    }

    private handleClick(event: Event) {
        const target = event.target as TreeItem;
        const treeItem = target.closest('tree-item-100541')!;
        const isExpandButton = event
            .composedPath()
            .some((el: any) => el?.classList?.contains('tree-item__expand-button'));

        //
        // Don't Do anything if there's no tree item, if it's disabled, or if the click doesn't match the initial target
        // from mousedown. The latter case prevents the user from starting a click on one item and ending it on another,
        // causing the parent node to collapse.
        //
        // See https://github.com/shoelace-style/shoelace/issues/1082
        //
        if (!treeItem || treeItem.disabled || target !== this.clickTarget) {
            return;
        }

        if (isExpandButton) {
            treeItem.expanded = !treeItem.expanded;
        } else {
            this.selectItem(treeItem);
        }
    }

    handleMouseDown(event: MouseEvent) {
        // Record the click target so we know which item the click initially targeted
        this.clickTarget = event.target as TreeItem;
    }

    private handleFocusOut = (event: FocusEvent) => {
        const relatedTarget = event.relatedTarget as HTMLElement;

        // If the element that got the focus is not in the tree
        if (!relatedTarget || !this.contains(relatedTarget)) {
            this.tabIndex = 0;
        }
    };

    private handleFocusIn = (event: FocusEvent) => {
        const target = event.target as TreeItem;

        // If the tree has been focused, move the focus to the last focused item
        if (event.target === this) {
            this.focusItem(this.lastFocusedItem || this.getAllTreeItems()[0]);
        }

        // If the target is a tree item, update the tabindex
        if (TreeItem.isTreeItem(target) && !target.disabled) {
            if (this.lastFocusedItem) {
                this.lastFocusedItem.tabIndex = -1;
            }
            this.lastFocusedItem = target;
            this.tabIndex = -1;

            target.tabIndex = 0;
        }
    };

    private handleSlotChange() {
        const items = this.getAllTreeItems();
        items.forEach(this.initTreeItem);
    }

    @watch('selection')
    async handleSelectionChange() {
        const isSelectionMultiple = this.selection === 'multiple';
        const items = this.getAllTreeItems();

        this.setAttribute('aria-multiselectable', isSelectionMultiple ? 'true' : 'false');

        for (const item of items) {
            item.selectable = isSelectionMultiple;
        }

        if (isSelectionMultiple) {
            await this.updateComplete;

            [...(this.querySelectorAll(':scope > tree-item-100541') as any)].forEach((treeItem: TreeItem) =>
                syncCheckboxes(treeItem, true)
            );
        }
    }

    /** @internal Returns the list of tree items that are selected in the tree. */
    get selectedItems(): TreeItem[] {
        const items = this.getAllTreeItems();
        const isSelected = (item: TreeItem) => item.selected;

        return items.filter(isSelected);
    }

    /** @internal Gets focusable tree items in the tree. */
    getFocusableItems() {
        const items = this.getAllTreeItems();
        const collapsedItems = new Set();

        return items.filter(item => {
            // Exclude disabled elements
            if (item.disabled) return false;

            // Exclude those whose parent is collapsed or loading
            const parent: TreeItem | null | undefined = item.parentElement?.closest('[role=treeitem]');
            if (parent && (!parent.expanded || parent.loading || collapsedItems.has(parent))) {
                collapsedItems.add(item);
            }

            return !collapsedItems.has(item);
        });
    }

    render() {
        return html`
      <div
        part="base"
        class="tree"
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
        <span hidden aria-hidden="true"><slot name="expand-icon"></slot></span>
        <span hidden aria-hidden="true"><slot name="collapse-icon"></slot></span>
      </div>
    `;
    }

}


declare global {
    interface HTMLElementTagNameMap {
        'tree-100541': Tree;
    }
}