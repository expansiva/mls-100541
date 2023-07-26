/// <mls shortName="enhancementLit" project="100541" enhancement="_100541_enhancementLit" />

export const description = "Use this enhancement for model using lit - a simple and fast web component.\nRef: https://lit.dev/"

export const example = `

    /**
     * MLS Implementation
     * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
     * The original project is licensed under the MIT license.
     * @mlsComponentDetails {"webComponentDependencies": []}
     */

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


export const onBeforeCompile = (model: mls.l2.editor.IMFile) => {
    console.info('onBeforeCompile');
    model;
    const op = monaco.languages.typescript.typescriptDefaults.getCompilerOptions();

    op['paths'] = {
        "lit": ["file://server/_100541_litElement.ts"],
        "lit/decorators.js": ["file://server/_100541_litDecorators.ts"],
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(op);
    model.compilerResults.modelNeedCompile = true;

}

const preparePreviewHtml = (model: mls.l2.editor.IMFile): string => {
    const tag = convertFileNameToTag(`_${model.storFile.project}_${model.storFile.shortName}`);
    return `<${tag}></${tag}>`;
}

export const getDesignDetails = (model: mls.l2.editor.IMFile): Promise<mls.l2.js.IDesignDetailsReturn> => {

    return new Promise<mls.l2.js.IDesignDetailsReturn>((resolve, reject) => {
        try {
            const ret = {} as mls.l2.js.IDesignDetailsReturn;
            ret.defaultHtmlExamplePreview = preparePreviewHtml(model);
            ret.properties = getPropierties(model);
            ret.webComponentDependencies = getComponentDependencies(model);
            ret['dependencies'] = ret.webComponentDependencies
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    })

}

export const convertTagToFileName = (tag: string) => {
    const regex = /(.+)-(\d+)/;
    const match = tag.match(regex);

    if (match) {
        const [, rest, number] = match;
        const convertedSrc = rest.replace(/-(.)/g, (_, letter) => letter.toUpperCase());
        tag = `_${number}_${convertedSrc}`;
    }
    return tag;
}

export const convertFileNameToTag = (widget: string) => {
    const regex = /_([0-9]+)_?(.*)/;
    const match = widget.match(regex);
    if (match) {
        const [, number, rest] = match;
        const convertedSrc = rest.replace(/([A-Z])/g, '-$1').toLowerCase();
        widget = `${convertedSrc}-${number}`;
    }
    return widget;
}

export const prepareAdd = (prompt: string): { sourceTS: string, aiHeader: string, aiBody: string, aiDelimiter: string } => {
    const aiHeader = `
        typescript, crie e me mostre em apenas um codigo um web componente baseado no lit element, que inicia com:::
        import { html, css, LitElement } from 'lit'; 
        import { customElement, property } from 'lit/decorators.js';

        @customElement('litteste-100530')
        export class SimpleGreeting extends LitElement {

        ::: e com as funcionalidades:::`;
    const aiBody = prompt;
    const aiDelimiter = ':::';
    const sourceTS = '';
    const ret = { sourceTS, aiHeader, aiBody, aiDelimiter }
    return ret;
}

export const onAfterChange = (model: mls.l2.editor.IMFile): string => {
    try {
        validateTagName(model)
        return '';
    } catch (e) {
        return e.message;
    }
};

export const getPromptDefault = (): string => {
    return `
    Propriedade: O componente aceitar� uma propriedade 'name'.

    Funcionalidade: O componente web exibir� um cabe�alho h1 estilizado em azul. O conte�do do cabe�alho ser� uma mensagem de sauda��o que l� 'Ol�,' seguido pelo valor da propriedade 'name'. Por exemplo, se a propriedade 'name' estiver definida como 'Jo�o', a mensagem exibida ser� 'Ol�, Jo�o!'.`;
}

export const getPublishDetails = (_mfile: mls.l2.editor.IMFile): mls.l2.editor.IRequire[] => {

    const ret: mls.l2.editor.IRequire[] = [];
    ret.push({
        type: "cdn",
        name: "lit",
        ref: "https://cdn.jsdelivr.net/gh/lit/dist@2.7.5/all/lit-all.min.js",

    });
    ret.push({
        type: "cdn",
        name: "lit/decorators.js",
        ref: "https://cdn.jsdelivr.net/npm/lit-element@3.3.2/+esm",

    });
    return ret;
}

function validateTagName(mfile: mls.l2.editor.IMFile) {
    mfile.storFile.hasError = false;
    clearErrorsOnModel(mfile.model)

    if (!mfile || !mfile.compilerResults) return;
    if (mfile.shortName === 'enhancementLit' && mfile.project === 100530) return;
    const decorators: IDecoratorDictionary = JSON.parse(mfile.compilerResults.decorators);
    if (!decorators) return;
    const decoratorToCheck = 'customElement'

    Object.entries(decorators).forEach((entrie) => {
        const decoratorInfo: IDecoratorDetails = entrie[1];
        if (!decoratorInfo || decoratorInfo.type !== 'ClassDeclaration') return;
        decoratorInfo.decorators.forEach((_decorator) => {
            const decoratorInfo = getDecoratorClassInfo(_decorator.text);
            if (!decoratorInfo || decoratorInfo.decoratorName !== decoratorToCheck) return;
            const correctTagName = convertFileNameToTag(`_${mfile.project}_${mfile.shortName}`);
            if (correctTagName !== decoratorInfo.tagName) {
                setErrorOnModel(mfile.model, _decorator.line + 1, decoratorToCheck.length + 3, _decorator.text.length + 1, `Invalid web component tag name, the correct definition is: ${correctTagName}`);
                mfile.storFile.hasError = true;
            }
        })
    })
}

function setErrorOnModel(model: monaco.editor.ITextModel, line: number, startColumn: number, endColumn: number, message: string,): void {
    const markerOptions = {
        severity: monaco.MarkerSeverity.Error,
        message,
        startLineNumber: line,
        startColumn,
        endLineNumber: line,
        endColumn: endColumn,
    };;
    monaco.editor.setModelMarkers(model, 'markerSource', [markerOptions]);
}

function clearErrorsOnModel(model: monaco.editor.ITextModel) {
    monaco.editor.setModelMarkers(model, 'markerSource', []);
}

function getDecoratorClassInfo(decoratorString: string): IDecoratorClassInfo {
    const regex = /(\w+)\(['"](.+?)['"]\)/;
    const match = decoratorString.match(regex);
    let result: IDecoratorClassInfo;
    if (match && match.length > 2) {
        const decoratorName = match[1];
        const tagName = match[2];
        result = {
            decoratorName,
            tagName,
        };
    }
    return result;
}

export function getComponentDependencies(model: mls.l2.editor.IMFile): string[] {

    const { devDoc } = model.compilerResults;
    if (!devDoc) return [];
    const objDocs: IJSDoc[] = JSON.parse(devDoc);
    const classInfoString = getJsDocClassInfoTag(objDocs);

    // Regular expression to match the dependencies array
    const regex = /"webComponentDependencies"\s*:\s*(\[.*?\])/;
    // Executing the regular expression and extracting the matched group
    const match = classInfoString.match(regex);

    // Check if the regex found a match and extract the dependencies array
    let dependenciesArray = [];
    if (match && match.length === 2) {
        try {
            dependenciesArray = JSON.parse(match[1]);
            dependenciesArray = dependenciesArray.map((tag: string) => convertTagToFileName(tag));
        } catch (error) {
            // Handle the error if the JSON parsing fails
            console.error('Error parsing webComponentDependencies array:', error);
            dependenciesArray = [];
        }
    }
    return dependenciesArray;
}

export function getPropierties(model: mls.l2.editor.IMFile): mls.l2.js.IProperties[] {
    let rc: mls.l2.js.IProperties[] = [];
    rc = getPropiertiesByDecorators(model);
    rc = getMoreInfoInJsDoc(model, rc)
    return rc;
}

function getJsDocClassInfoTag(objDocs: IJSDoc[]): string {
    for (const doc of objDocs) {
        if (doc.type !== 'constructor') continue;
        const tagComponentDetails = doc.tags.find((tag) => tag.tagName === 'mlsComponentDetails');
        if (!tagComponentDetails) return '';
        return tagComponentDetails.comment;
    }
}

function getDefaultPropierties(): mls.l2.js.IProperties[] {
    return [
        {
            propertyName: 'class',
            propertyType: 'string',
            sectionName: 'principal',
            defaultValue: '',
            hint: 'css classes'
        },
        {
            propertyName: 'id',
            propertyType: 'string',
            sectionName: 'principal',
            defaultValue: '',
            pattern: '^[_a-zA-Z]\\w*$',
            hint: 'identifier for javascript manipulation'
        }
    ]
}

function getPropiertiesByDecorators(model: mls.l2.editor.IMFile): mls.l2.js.IProperties[] {
    const { decorators } = model.compilerResults;
    if (!decorators) return [];
    const rc: mls.l2.js.IProperties[] = [];
    const objDecorators: IDecoratorDictionary = JSON.parse(decorators);

    Object.entries(objDecorators).forEach((entrie) => {
        const item: IDecoratorDetails = entrie[1];
        if (item.type === 'PropertyDeclaration') {
            const propertyName = item.parentName;
            item.decorators.forEach((decorator) => {
                if (decorator.text.startsWith('property(')) {
                    const prop: mls.l2.js.IProperties = {} as mls.l2.js.IProperties;
                    const propertyType = getPropType(decorator.text)?.toLowerCase();
                    prop.propertyName = propertyName;
                    if (propertyType) prop.propertyType = propertyType;
                    rc.push(prop);
                }
            })
        }
    });
    const defaultProps = getDefaultPropierties();
    return [...defaultProps, ...rc];
}

function getMoreInfoInJsDoc(model: mls.l2.editor.IMFile, propierties: mls.l2.js.IProperties[]): mls.l2.js.IProperties[] {
    const { devDoc } = model.compilerResults;
    if (!devDoc) return propierties;
    const objDocs: IJSDoc[] = JSON.parse(devDoc);
    const jsDocProps = getJSDocPropierties(objDocs);
    for (let i = 0; i < propierties.length; i++) {
        let prop = propierties[i];
        const propInPropsJsDoc = jsDocProps.find((_prop) => _prop.propertyName === prop.propertyName);
        if (propInPropsJsDoc) {
            prop = {
                ...propInPropsJsDoc, ...prop
            }
            propierties[i] = prop;
        }
    }
    return propierties;
}

function getJSDocPropierties(objDocs: IJSDoc[]): mls.l2.js.IProperties[] {
    const rc: mls.l2.js.IProperties[] = [];
    for (const doc of objDocs) {
        if (doc.type !== 'class') continue;
        const docMembersProp = doc.members.filter((m) => {
            const isProp = m.type === 'property'
            let isLitProp = false;
            if (isProp) {
                const { modifiers } = m;
                isLitProp = isDecoratorProp(modifiers);
            }
            return isProp && isLitProp
        });

        docMembersProp.forEach((prop) => {
            const propItem: mls.l2.js.IProperties = {} as mls.l2.js.IProperties;
            const fieldType = getFieldTypeInfo(prop.tags);
            const sectionName = getSectionsTag(fieldType);
            const propType = getPropTypeTag(fieldType);
            propItem.hint = prop.comment;
            propItem.propertyName = prop.name;
            if (fieldType?.defaultValue) propItem.defaultValue = fieldType?.defaultValue;
            if (propType) propItem.propertyType = propType;
            if (sectionName) propItem.sectionName = sectionName;
            if (fieldType?.cols) propItem.cols = fieldType?.cols;
            if (fieldType?.rows) propItem.rows = fieldType?.rows;
            if (fieldType?.pattern) propItem.pattern = fieldType?.pattern;
            if (fieldType?.max) propItem.max = fieldType?.max;
            if (fieldType?.min) propItem.min = fieldType?.min;
            if (fieldType?.step) propItem.step = fieldType?.step;
            if (fieldType?.maxLength) propItem.maxLength = fieldType?.maxLength;
            if (fieldType?.items) propItem.items = fieldType?.items;
            rc.push(propItem)
        })
    }
    return rc;
}

function getPropType(propertyString: string): string {
    const typeRegex = /type:\s*([A-Za-z]+)/;
    const match = propertyString.match(typeRegex);
    if (match && match.length > 1) {
        const typeProp = match[1];
        return typeProp;
    }
    return undefined;
}

function isDecoratorProp(modifiers: string[]): boolean {
    if (!modifiers) return false;
    const searchStr = '@property(';
    for (const item of modifiers) {
        if (item.startsWith(searchStr)) return true;
    }
    return false;
}

function getFieldTypeInfo(tags: ITag[]): mls.l2.js.IProperties {
    const tag = tags.find((item) => item.tagName === 'fieldType');
    if (!tag) return undefined;
    try {
        const rc = JSON.parse(tag.comment);
        return rc;
    } catch (err) {
        return undefined;
    }
}

function getSectionsTag(fieldType: mls.l2.js.IProperties): mls.l2.js.ISectionName {
    const defaultSection = 'principal'
    if (!fieldType) return defaultSection;
    const { sectionName } = fieldType;
    if (!sectionName) return defaultSection;
    const valueFormated = sectionName.toLowerCase().trim();
    if (['principal', 'optional', 'advanced'].includes(valueFormated)) return valueFormated as mls.l2.js.ISectionName
    return defaultSection;
}

function getPropTypeTag(fieldType: mls.l2.js.IProperties): string {
    const defaultType = 'string'
    if (!fieldType) return defaultType;
    const { propertyType } = fieldType;
    if (!propertyType) return defaultType;
    const valueFormated = propertyType.toLowerCase().trim();
    if (['string', 'number', 'boolean', 'list'].includes(valueFormated)) return valueFormated;
    return defaultType;
}

export interface IMember {
    name: string;
    pos: number;
    type: string;
    comment: string;
    modifiers: string[];
    tags: ITag[];
    parameters?: IParameter[];
}

export interface ITag {
    name: string;
    tagName: string;
    comment: string;
}

export interface IParameter {
    name: string;
    comment: string;
    type: string;
    modifiers: string[];
}

export interface IJSDoc {
    name: string;
    pos: number;
    type: string;
    comment: string;
    members: IMember[];
    tags: ITag[];
}

export interface IDecoratorClassInfo {
    decoratorName: string,
    tagName: string,
}

export interface IDecoratorItem {
    line: number;
    character: number;
    text: string;
}

export interface IDecoratorDetails {
    parentName: string;
    type: string;
    pos: number;
    decorators: IDecoratorItem[];
}

export interface IDecoratorDictionary {
    [key: number]: IDecoratorDetails
}