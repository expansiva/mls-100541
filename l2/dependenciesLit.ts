/// <mls shortName="dependenciesLit" project="100541" enhancement="_blank" />

import { convertTagToFileName } from './_100541_utilsLit'
import type { IJSDoc } from './_100541_propiertiesLit';
import { setErrorOnModel } from './_100541_validateLit'

export function getComponentDependencies(model: mls.l2.editor.IMFile): string[] {

    const { devDoc } = model.compilerResults as any;
    if (!devDoc) return [];
    const objDocs: IJSDoc[] = JSON.parse(devDoc);
    const tagsInfoString = getJsDocInfoTags(objDocs);
    if (!tagsInfoString) return [];

    // Regular expression to match the dependencies array
    const regex = /"webComponentDependencies"\s*:\s*(\[.*?\])/;
    // Regular expression to match the dependencies array
    const regexVerify = /"webComponentDependencies"\s*:\s*(\[.*?)/;
    // Executing the regular expression and extracting the matched group
    const match = tagsInfoString.match(regex);
    const matchVerify = tagsInfoString.match(regexVerify);

    if (matchVerify && !match) {

        model.storFile.hasError = true;

        setErrorOnModel(model.model, 1, 0, 10, 'Line breaks are not allowed in webComponentDependencies');

        mls.events.fireFileAction('statusOrErrorChanged', model.storFile, 'left');
        mls.events.fireFileAction('statusOrErrorChanged', model.storFile, 'right');

        return [];

    }

    // Check if the regex found a match and extract the dependencies array
    let dependenciesArray = [];
    if (match && match.length === 2) {
        try {
            dependenciesArray = JSON.parse(match[1]);
            dependenciesArray = dependenciesArray.map((tag: string) => convertTagToFileName(tag));
        } catch (error) {
            // Handle the error if the JSON parsing fails
            //console.error('Error parsing webComponentDependencies array :', error);
            model.storFile.hasError = true;

            setErrorOnModel(model.model, 1, 0, 10, 'Error parsing webComponentDependencies array :');

            mls.events.fireFileAction('statusOrErrorChanged', model.storFile, 'left');
            mls.events.fireFileAction('statusOrErrorChanged', model.storFile, 'right');
            dependenciesArray = [];
        }
    }
    return dependenciesArray;
}

function getJsDocInfoTags(objDocs: IJSDoc[]): string | undefined {
    for (const doc of objDocs) {
        if (doc.type !== 'constructor') continue;
        const tagComponentDetails = doc.tags.find((tag) => tag.tagName === 'mlsComponentDetails');
        if (!tagComponentDetails) return '';
        return tagComponentDetails.comment;
    }
}
