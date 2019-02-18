'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from "fs";
import * as vscode from 'vscode';
import { decryptCurrentEditor, decryptTextDoc, decryptText } from './commands/decrypt';
import { isTargetFile, isEncryptFile } from './helper';
import encrypt from './commands/encrypt';
// import { showPreviewPanel } from './components/previewPanel';
import { endsWith } from 'ramda';
import { ReadonlyFileProvider } from './providers/ReadonlyFile';
import { Uri, commands } from 'vscode';
import * as R from 'ramda';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "auto-encrypt" is now active!');

    let onCommand_1 = vscode.commands.registerCommand('auto-encrypt.decrypt', decryptCurrentEditor);
    let onCommand_2 = vscode.commands.registerCommand('auto-encrypt.encrypt', encrypt);

    const onSave = vscode.workspace.onWillSaveTextDocument(async (event: vscode.TextDocumentWillSaveEvent) => {
        if (!await isTargetFile(event.document)) {
            return;
        }
        encrypt(event);
    });

    vscode.workspace.onDidOpenTextDocument(async TextDocument => {

        const { fileName } = TextDocument;

        console.log(fileName);

        if(endsWith('.encrypt', fileName)) {
            // const text = decryptTextDoc(TextDocument);
            const right = Uri.parse('readonlyFile:///' + fileName);
            const getPath = R.pipe(
                R.split('.encrypt'),
                R.dropLast(1),
                R.join('/')
            );

            const originPath = getPath(fileName);
            const left = Uri.parse('file:///' + originPath);

            commands.executeCommand('vscode.diff', left, right, 'a.js <-> a.js.encrypt(decrypt)', {preview: false});
            // showPreviewPanel(text);
            return;
        }

        if (!await isTargetFile(TextDocument)) {
            return;
        }

        let encryptText;
        try {
            encryptText = await fs.readFileSync(fileName + '.encrypt', {
                encoding:'utf-8'
            });
        } catch (e) {
            // 文件不存在，不处理，啥都不做
            return;
        }
        const text = decryptText(encryptText);

        if (text === TextDocument.getText()) {
            // 如果文件没有变化，就不要折腾那么多了
            return;
        }

        await fs.writeFileSync(fileName, text);

        const smallFileName = fileName.replace(/\\/g, '/').split('/').pop();

        vscode.window.showInformationMessage(`file has been changed because ./${smallFileName}.encrypt has been changed`);
    });

    context.subscriptions.push(onCommand_1);
    context.subscriptions.push(onCommand_2);
    context.subscriptions.push(onSave);
    context.subscriptions.push(new ReadonlyFileProvider());

}

// this method is called when your extension is deactivated
export function deactivate() {
}