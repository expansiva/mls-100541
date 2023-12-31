/// <mls shortName="icon" project="100541" enhancement="_100541_enhancementLit" groupName="icon" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, isTemplateResult, LitElement, HTMLTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { watch } from './_100541_internalWatch';

const CACHEABLE_ERROR = Symbol();
const RETRYABLE_ERROR = Symbol();
type SVGResult = HTMLTemplateResult | SVGSVGElement | typeof RETRYABLE_ERROR | typeof CACHEABLE_ERROR;

let parser: DOMParser;
const iconCache = new Map<string, Promise<SVGResult>>();

@customElement('icon-100541')
export class Icon extends LitElement {

    @state() private svg: SVGElement | HTMLTemplateResult | null = null;

    /** The name of the icon to draw. Available names depend on the icon library being used. */
    @property({ reflect: true }) name?: string;

    /**
     * An external URL of an SVG file. Be sure you trust the content you are including, as it will be executed as code and
     * can result in XSS attacks.
     */
    @property() src?: string;

    /**
     * An alternate description to use for assistive devices. If omitted, the icon will be considered presentational and
     * ignored by assistive devices.
     */
    @property() label = '';

    /**
    * The name of a registered custom icon library. 
    * @fieldType { "propertyType":"list", "defaultValue":"default", "items": ["default" , "fa"]}
    */
    @property({ reflect: true }) library = 'default';


    connectedCallback() {
        super.connectedCallback();
        this.registerIconLibrary('fa', {
            resolver: (name: string) => {
                const filename = name.replace(/^fa[rbs]-/, '');
                let folder = 'regular';
                if (name.substring(0, 4) === 'fas-') folder = 'solid';
                if (name.substring(0, 4) === 'fab-') folder = 'brands';
                return `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.1/svgs/${folder}/${filename}.svg`;
            },
            mutator: (svg: HTMLElement) => svg.setAttribute('fill', 'currentColor')
        });
        this.watchIcon(this);
    }

    firstUpdated() {
        this.initialRender = true;
        this.setIcon();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unwatchIcon(this);
    }

    private getUrl() {
        const library = this.getIconLibrary(this.library);
        if (this.name && library) {
            return library.resolver(this.name);
        }
        return this.src;
    }

    @watch('label')
    handleLabelChange() {
        const hasLabel = typeof this.label === 'string' && this.label.length > 0;

        if (hasLabel) {
            this.setAttribute('role', 'img');
            this.setAttribute('aria-label', this.label);
            this.removeAttribute('aria-hidden');
        } else {
            this.removeAttribute('role');
            this.removeAttribute('aria-label');
            this.setAttribute('aria-hidden', 'true');
        }
    }

    @watch(['name', 'src', 'library'])
    async setIcon() {
        const library = this.getIconLibrary(this.library);
        const url = this.getUrl();

        if (!url) {
            this.svg = null;
            return;
        }

        let iconResolver = iconCache.get(url);
        if (!iconResolver) {
            iconResolver = this.resolveIcon(url, library);
            iconCache.set(url, iconResolver);
        }

        // If we haven't rendered yet, exit early. This avoids unnecessary work due to watching multiple props.
        if (!this.initialRender) {
            return;
        }

        const svg = await iconResolver;

        if (svg === RETRYABLE_ERROR) {
            iconCache.delete(url);
        }

        if (url !== this.getUrl()) {
            // If the url has changed while fetching the icon, ignore this request
            return;
        }

        if (isTemplateResult(svg)) {
            this.svg = svg as any;
            return;
        }

        switch (svg) {
            case RETRYABLE_ERROR:
            case CACHEABLE_ERROR:
                this.svg = null;
                break;
            default:
                this.svg = (svg as any).cloneNode(true) as SVGElement;
                library?.mutator?.(this.svg);
        }
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return this.svg;
    }

    private icons: any = {
        caret: `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `,
        check: `
            <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                <g stroke="currentColor" stroke-width="2">
                <g transform="translate(3.428571, 3.428571)">
                    <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
                    <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
                </g>
                </g>
            </g>
            </svg>
        `,
        'chevron-down': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
        `,
        'chevron-left': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
        `,
        'chevron-right': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        `,
        eye: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
            </svg>
        `,
        'eye-slash': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
            </svg>
        `,
        eyedropper: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
            <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
            </svg>
        `,
        'grip-vertical': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
            </svg>
        `,
        indeterminate: `
            <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                <g stroke="currentColor" stroke-width="2">
                <g transform="translate(2.285714, 6.857143)">
                    <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
                </g>
                </g>
            </g>
            </svg>
        `,
        'person-fill': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            </svg>
        `,
        'play-fill': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
            </svg>
        `,
        'pause-fill': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
            </svg>
        `,
        radio: `
            <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g fill="currentColor">
                <circle cx="8" cy="8" r="3.42857143"></circle>
                </g>
            </g>
            </svg>
        `,
        'star-fill': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
        `,
        'x-lg': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
        `,
        'x-circle-fill': `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
            </svg>
        `
    };

    private systemLibrary: IconLibrary = {
        name: 'default',
        resolver: (name: keyof typeof this.icons) => {
            if (name in this.icons) {
                return `data:image/svg+xml,${encodeURIComponent(this.icons[name])}`;
            }
            return '';
        }
    };

    private registry: IconLibrary[] = [this.systemLibrary];
    private watchedIcons: Icon[] = [];

    /** Adds an icon to the list of watched icons. */
    private watchIcon(icon: Icon) {
        this.watchedIcons.push(icon);
    }

    /** Removes an icon from the list of watched icons. */
    private unwatchIcon(icon: Icon) {
        this.watchedIcons = this.watchedIcons.filter(el => el !== icon);
    }

    /** Returns a library from the registry. */
    private getIconLibrary(name?: string) {
        return this.registry.find(lib => lib.name === name);
    }

    /** Adds an icon library to the registry, or overrides an existing one. */
    private registerIconLibrary(name: string, options: any) {
        this.unregisterIconLibrary(name);
        this.registry.push({
            name,
            resolver: options.resolver,
            mutator: options.mutator,
            spriteSheet: options.spriteSheet
        });

        // Redraw watched icons
        this.watchedIcons.forEach(icon => {
            if (icon.library === name) {
                icon.setIcon();
            }
        });
    }

    /** Removes an icon library from the registry. */
    private unregisterIconLibrary(name: string) {
        this.registry = this.registry.filter(lib => lib.name !== name);
    }

    private initialRender = false;

    /** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
    private async resolveIcon(url: string, library?: IconLibrary): Promise<SVGResult> {
        let fileData: Response;

        if (library?.spriteSheet) {
            return html`<svg part="svg">
                <use part="use" href="${url}"></use>
            </svg>`;
        }

        try {
            fileData = await fetch(url, { mode: 'cors' });
            if (!fileData.ok) return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR;
        } catch {
            return RETRYABLE_ERROR;
        }

        try {
            const div = document.createElement('div');
            div.innerHTML = await fileData.text();

            const svg = div.firstElementChild;
            if (svg?.tagName?.toLowerCase() !== 'svg') return CACHEABLE_ERROR;

            if (!parser) parser = new DOMParser();
            const doc = parser.parseFromString(svg.outerHTML, 'text/html');

            const svgEl = doc.body.querySelector('svg') as any;
            if (!svgEl) return CACHEABLE_ERROR;

            svgEl.part.add('svg');
            return document.adoptNode(svgEl);
        } catch {
            return CACHEABLE_ERROR;
        }
    }


}

type IconLibraryResolver = (name: string) => string;
type IconLibraryMutator = (svg: SVGElement) => void;
interface IconLibrary {
    name: string;
    resolver: IconLibraryResolver;
    mutator?: IconLibraryMutator;
    spriteSheet?: boolean;
}
