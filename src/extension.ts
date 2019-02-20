'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from "fs";
import * as path from "path";
import * as vscode from 'vscode';
import { decryptCurrentEditor, decryptText } from './commands/decrypt';
import { isTargetFile } from './helper';
import encrypt from './commands/encrypt';
// import { showPreviewPanel } from './components/previewPanel';
import { endsWith } from 'ramda';
import { ReadonlyFileProvider } from './providers/ReadonlyFile';
import { Uri, commands } from 'vscode';

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

            let { dir, name } = path.parse(fileName);
            const originFileName = dir + '/' + name;

            const right = Uri.parse('readonlyFile:///' + originFileName);
            const left = Uri.parse('file:///' + originFileName);

            commands.executeCommand('vscode.diff',
              left,
              right,
              `${name} <-> ${name}.encrypt(decrypt)`,
              {preview: false}
            );
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