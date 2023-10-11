/// <mls shortName="enhancementLit" project="100541" enhancement="_blank" />

import { convertFileNameToTag } from './_100541_utilsLit'
import { getPropierties } from './_100541_propiertiesLit'
import { getComponentDependencies } from './_100541_dependenciesLit'
import { validateTagName, validateRender } from './_100541_validateLit'
import { setCodeLens } from './_100541_codeLensLit'
import { injectStyle, MLS_GETDEFAULTDESIGNSYSTEM } from './_100541_processCssLit'


export const description = "Use this enhancement for model using lit - a simple and fast web component.\nRef: https://lit.dev/"


export const example = `
    import { html, css, LitElement } from 'lit'; 
    import { customElement, property } from 'lit/decorators.js';

    @customElement('litteste-100541')
    export class SimpleGreeting extends LitElement {
        static styles = css\`p { color: red }\`;

        @property() 
        name: string = 'Somebody';

        render() {
            return html\`<p> Hello, \${ this.name } !</p>\`;
        }
    }`;

export const requires: mls.l2.editor.IRequire[] = [
    {
        type: 'tspath',
        name: 'lit',
        ref: "file://server/_100541_litElement.ts"
    },
    {
        type: 'tspath',
        name: 'lit/decorators.js',
        ref: "file://server/_100541_litDecorators.ts"
    },
    {
        type: 'tspath',
        name: 'mobx',
        ref: "file://server/mobx.ts"
    },
    {
        type: "cdn",
        name: "lit",
        ref: "https://cdn.jsdelivr.net/gh/lit/dist@2.7.5/all/lit-all.min.js",

    },
    {
        type: "cdn",
        name: "lit/decorators.js",
        ref: "https://cdn.jsdelivr.net/npm/lit-element@3.3.2/+esm",

    }
];


const getDefaultHtmlExamplePreview = (model: mls.l2.editor.IMFile): string => {
    const tag = convertFileNameToTag(`_${model.storFile.project}_${model.storFile.shortName}`);
    return `<${tag}></${tag}>`;
}

export const getDesignDetails = (model: mls.l2.editor.IMFile): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return new Promise<mls.l2.enhancement.IDesignDetailsReturn>((resolve, reject) => {
        try {
            const ret = {} as mls.l2.enhancement.IDesignDetailsReturn;
            ret.defaultHtmlExamplePreview = getDefaultHtmlExamplePreview(model);
            ret.properties = getPropierties(model);
            ret.webComponentDependencies = getComponentDependencies(model);
            ret['servicePreviewDefault'] = '_100532_service_preview';
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    })
}

export const prepareAdd = (prompt: string): { sourceTS: string, aiHeader: string, aiBody: string, aiDelimiter: string } => {
    const aiHeader = `
        typescript, crie e me mostre em apenas um codigo um web componente baseado no lit element, que inicia com:::
        import { html, css, LitElement } from 'lit'; 
        import { customElement, property } from 'lit/decorators.js';

        @customElement('litteste-100541')
        export class SimpleGreeting extends LitElement {

        ::: e com as funcionalidades:::`;
    const aiBody = prompt;
    const aiDelimiter = ':::';
    const sourceTS = '';
    const ret = { sourceTS, aiHeader, aiBody, aiDelimiter }
    return ret;
}

export const onAfterChange = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    try {
        validateTagName(mfile);
        validateRender(mfile)
        setCodeLens(mfile);
        // await injectStyle(mfile, 0);
    } catch (e) {
        return e.message;
    }
};

export const getPromptDefault = (): string => {
    return `
    Propriedade: O componente aceitará uma propriedade 'name'.

    Funcionalidade: O componente web exibirá um cabeçalho h1 estilizado em azul. O conteúdo do cabeçalho será uma mensagem de saudação que lê 'Olá,' seguido pelo valor da propriedade 'name'. Por exemplo, se a propriedade 'name' estiver definida como 'João', a mensagem exibida será 'Olá, João!'.`;
}

export const onAfterCompile = async (mfile: mls.l2.editor.IMFile): Promise<void> => {

    await injectStyle(mfile, 0);
    return;

}

