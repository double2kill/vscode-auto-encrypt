'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from "fs";
import * as vscode from 'vscode';
import { decryptCurrentEditor, decryptText } from './commands/decrypt';
import { isTargetFile } from './helper';
import encrypt from './commands/encrypt';
import { showDiff } from './commands/showDiff';
import { ReadonlyFileProvider } from './providers/ReadonlyFile';
import { showFileChangedInfo } from './components/showFileChangedInfo'
import { DocumentSchemes } from './constants';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, Extension "auto-encrypt" is now active!');

    const onCommand_1 = vscode.commands.registerCommand('auto-encrypt.decrypt', decryptCurrentEditor);
    const onCommand_2 = vscode.commands.registerCommand('auto-encrypt.encrypt', encrypt);
    const onCommand_3 = vscode.commands.registerCommand('auto-encrypt.showDiff', showDiff);

    context.subscriptions.push(onCommand_1);
    context.subscriptions.push(onCommand_2);
    context.subscriptions.push(onCommand_3);

    const onSave = vscode.workspace.onWillSaveTextDocument(async (event: vscode.TextDocumentWillSaveEvent) => {
        if (!await isTargetFile(event.document)) {
            return;
        }
        encrypt(event);
    });

    vscode.workspace.onDidOpenTextDocument(async TextDocument => {

        const { fileName } = TextDocument;

        console.log(fileName);

        if (!await isTargetFile(TextDocument) || vscode.window.activeTextEditor && (vscode.window.activeTextEditor.document.uri.scheme === DocumentSchemes.ReadonlyFile)) {
            return;
        }

        let encryptText;
        try {
            encryptText = await fs.readFileSync(fileName + '.encrypt', {
                encoding: 'utf-8'
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

        showFileChangedInfo(fileName);
    });

    context.subscriptions.push(onSave);
    context.subscriptions.push(new ReadonlyFileProvider());

}

// this method is called when your extension is deactivated
export function deactivate() {
}