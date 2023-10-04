/// <mls shortName="processCssLit" project="100541" enhancement="_blank" />			
import { convertFileNameToTag } from './_100541_utilsLit'

export const MLS_GETDEFAULTDESIGNSYSTEM = '[[mls_getDefaultDesignSystem]]';
export async function injectStyle(model: mls.l2.editor.IMFile, dsIndex: number): Promise<void> {
    const js = model.compilerResults?.prodJS;
    if (js && js.indexOf(MLS_GETDEFAULTDESIGNSYSTEM) === -1) return;

    const ds = mls.l3.getDSInstance(model.project, dsIndex);
    if (!ds) return;
    await ds.init();
    const fileName = `_${model.project}_${model.shortName}`;
    const tagName = convertFileNameToTag(fileName)
    const css = await ds.components.getCSS(fileName);
    if (!css) return;
    const css2 = getCssWithoutTag(css, tagName)
    model.compilerResults.prodJS = model.compilerResults.prodJS.replace(MLS_GETDEFAULTDESIGNSYSTEM, css2)
    return;
}

function getCssWithoutTag(css: string, tag: string): string {
    const originalString = css;
    const regex = /(\w+-\d+)\.(\w+)\s+/;
    let modifiedString = originalString.replace(regex, ':host(.$2) ');
    const searchString = tag;
    const replacementString = '';
    modifiedString = modifiedString.replace(new RegExp(searchString, "g"), replacementString);
    modifiedString = replaceBackTicks(modifiedString);
    modifiedString = decodeString(modifiedString)
    return modifiedString;
}

function replaceBackTicks(originalString: string): string {
    const stringWithSingleQuotes = originalString.replace(/`/g, "'");
    return stringWithSingleQuotes;
}

function decodeString(cssString: string) {
    return decodeURIComponent(cssString)
}
