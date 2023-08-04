/// <mls shortName="validateLit" project="100541" enhancement="_blank" />
				
import type { IDecoratorDictionary, IDecoratorDetails, IDecoratorClassInfo } from './_100541_propiertiesLit';
import { convertFileNameToTag } from './_100541_utilsLit';

export function validateTagName(mfile: mls.l2.editor.IMFile) {
    mfile.storFile.hasError = false;
    clearErrorsOnModel(mfile.model)

    if (!mfile || !mfile.compilerResults) return;
    if (mfile.shortName === 'enhancementLit' && mfile.project === 100541) return;
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