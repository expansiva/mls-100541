/// <mls shortName="codeLensLit" project="100541" enhancement="_blank" />

import type { IDecoratorDictionary, IDecoratorDetails } from './_100541_propiertiesLit';

// File: CodeLens
export function setCodeLens(mfile: mls.l2.editor.IMFile) {
    clearCodeLens(mfile);
    const { model, compilerResults } = mfile;
    const { decorators } = compilerResults;
    if (mfile.shortName === 'enhancementLit' && mfile.project === 100541) return;
    setCodeLensDecoratorClass(model, decorators);
    setCodeLensMlsComponents(model);
}

function clearCodeLens(mfile: mls.l2.editor.IMFile) {
    const keys = Object.keys(mfile.codeLens);
    keys.forEach((line) => {
        const codeLen = mfile.codeLens[line];
        if (codeLen[0].id === 'helpAssistant') {
            mls.l2.codeLens.removeCodeLen(mfile.model, Number.parseInt(line))
        }
    })

}

function setCodeLensDecoratorClass(model: monaco.editor.ITextModel, decorators: string) {
    const objDecorators: IDecoratorDictionary = JSON.parse(decorators);
    Object.entries(objDecorators).forEach((entrie) => {
        const decoratorInfo: IDecoratorDetails = entrie[1];
        if (!decoratorInfo || decoratorInfo.type !== 'ClassDeclaration') return;
        decoratorInfo.decorators.forEach((_decorator) => {
            if (_decorator.text.startsWith('customElement(')) {
                mls.l2.codeLens.addCodeLen(model, _decorator.line + 1, { id: 'helpAssistant', title: `customElement`, jsComm: '', refs: '_100532_doc_customElement' });
            }
        })
    })
}

function setCodeLensMlsComponents(model: monaco.editor.ITextModel) {
    const lines = findLinesByText(model, '@mlsComponentDetails');
    lines.forEach((line) => {
        mls.l2.codeLens.addCodeLen(model, line, { id: 'helpAssistant', title: `mlsComponentDetails`, jsComm: '', refs: '_100532_doc_mlsComponentDetails' });
    })
}

function findLinesByText(model: monaco.editor.ITextModel, textToFind: string): number[] {
    const lines: number[] = [];
    if (!model) return lines;
    const lineCount = model.getLineCount();
    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
        const lineText = model.getLineContent(lineNumber);
        if (lineText.includes(textToFind)) {
            lines.push(lineNumber);
        }
    }
    return lines;
}