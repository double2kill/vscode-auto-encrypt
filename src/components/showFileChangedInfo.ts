import * as path from "path";
import { Uri, commands, window, MessageItem } from 'vscode';
import { DocumentSchemes } from "../constants";
// import { showPreviewPanel } from './components/previewPanel';

export function showFileChangedInfo(fileName: string) {
    window.showInformationMessage<MessageItem>(`${fileName} has been detected is different with encrypt/decrypt file, do you want to show the diff?`, {
        isCloseAffordance: false,
        title: 'Yes',
    }, {
        isCloseAffordance: false,
        title: 'No',
    }).then((selectedData: any) => {
        if (selectedData.title === 'Yes') {
            showDiffDetail(fileName);
        }
    });
}

export function showDiffDetail(fileName: string) {
    // const text = decryptTextDoc(TextDocument);
    const extName = path.extname(fileName);
    const basename = path.basename(fileName, '.encrypt');
    let originFileName = fileName;

    if (extName === '.encrypt') {
        const dir = path.dirname(fileName);
        originFileName = path.join(dir, basename);
    }

    const left = Uri.file(originFileName);
    const right = Uri.parse(`${DocumentSchemes.ReadonlyFile}://${originFileName}`);

    // https://code.visualstudio.com/api/references/commands
    commands.executeCommand('vscode.diff',
        left,
        right,
        `${basename} <-> ${basename}.encrypt(decrypt)`,
        { preview: false }
    );
    // showPreviewPanel(text);
    return;
}