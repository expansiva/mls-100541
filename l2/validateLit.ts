/// <mls shortName="validateLit" project="100541" enhancement="_blank" />

import type { IDecoratorDictionary, IDecoratorDetails, IDecoratorClassInfo } from './_100541_propiertiesLit';
import { convertFileNameToTag } from './_100541_utilsLit';

export function validateTagName(mfile: mls.l2.editor.IMFile): boolean {

    mfile.storFile.hasError = false;
    clearErrorsOnModel(mfile.model)

    if (!mfile || !mfile.compilerResults) return false;
    if (mfile.shortName === 'enhancementLit' && mfile.project === 100541) return false;
    const decorators: IDecoratorDictionary = JSON.parse(mfile.compilerResults.decorators);
    if (!decorators) return false;
    const decoratorToCheck = 'customElement';
    let rc: boolean = false;

    Object.entries(decorators).forEach((entrie) => {
        const decoratorInfo: IDecoratorDetails = entrie[1];
        if (!decoratorInfo || decoratorInfo.type !== 'ClassDeclaration') return;
        decoratorInfo.decorators.forEach((_decorator) => {
            const decoratorInfo = getDecoratorClassInfo(_decorator.text);
            if (!decoratorInfo || decoratorInfo.decoratorName !== decoratorToCheck) return;
            const correctTagName = convertFileNameToTag(`_${mfile.project}_${mfile.shortName}`);
            if (correctTagName !== decoratorInfo.tagName) {
                rc = true;
                setErrorOnModel(mfile.model, _decorator.line + 1, decoratorToCheck.length + 3, _decorator.text.length + 1, `Invalid web component tag name, the correct definition is: ${correctTagName}`);
                mfile.storFile.hasError = true;
            }
        })
    })

    return rc;
}

export function validateRender(mfile: mls.l2.editor.IMFile): boolean {

    mfile.storFile.hasError = false;
    clearErrorsOnModel(mfile.model);
    if (!mfile || !mfile.compilerResults) return false;
    if (mfile.shortName === 'enhancementLit' && mfile.project === 100541) return false;
    const shortName = `_${mfile.project}_${mfile.shortName}`
    return verify(mfile.model, shortName, mfile)
}

function getDecoratorClassInfo(decoratorString: string): IDecoratorClassInfo | undefined {
    const regex = /(\w+)\(['"](.+?)['"]\)/;
    const match = decoratorString.match(regex);
    let result: IDecoratorClassInfo | undefined = undefined;
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

function verify(model: monaco.editor.ITextModel, shortName: string, mfile: mls.l2.editor.IMFile):boolean {
    const lines = model.getLinesContent();
    const tag = convertFileNameToTag(shortName);
    const msgError = `Do not use the same component tag (${tag}) within the rendering`;
    let htmlCount: number = 0;

    let rc: boolean = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        line = line.replace(/\/\/.*/, ''); // remove inline comment 
        const lineInCommentBlock = isInCommentBlock(lines, i + 1);
        line = line.replace(/\s+/g, ''); // remove blank spaces
        if (line.indexOf(`document.createElement('${tag}')`) >= 0 || 
        line.indexOf(`document.createElement("${tag}")`) >= 0) {
            mfile.storFile.hasError = true;
            setErrorOnModel(model, i + 1, 0, line.length, msgError);
            rc = true;
            break;
        }
        if (line.indexOf('html`') >= 0 && !lineInCommentBlock) htmlCount += 1;
        if (line.indexOf('`') >= 0 && line.indexOf('html`') === -1 && !lineInCommentBlock) htmlCount -= 1;

        if (htmlCount != 0) {
            if (line.indexOf('<' + tag) >= 0) {
                mfile.storFile.hasError = true;
                const column = model.getLineFirstNonWhitespaceColumn(i + 1);
                const length = model.getLineLength(i + 1)
                setErrorOnModel(model, i + 1, column, length, msgError);
                rc = true;
                break;
            }
        }
    }
    return rc;
}

function isInCommentBlock(lines: string[], lineNumber: number): boolean {
    let countStartBlockComment = 0;
    let countEndBlockComment = 0;
    for (let i = 0; i <= lineNumber - 1; i++) {
        const line = lines[i];
        if (line.indexOf('/*') >= 0) countStartBlockComment += 1;
        if (line.indexOf('*/') >= 0 && i !== lineNumber - 1) countEndBlockComment += 1;
    }
    const isInBlockComment = countStartBlockComment > countEndBlockComment;
    return isInBlockComment;
};

