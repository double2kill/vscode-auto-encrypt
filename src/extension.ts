'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { decryptCurrentEditor , decryptTextDoc } from './commands/decrypt';
import encrypt from './commands/encrypt';
import fs = require('fs');
var AES = require("crypto-js/aes");
var enc_utf8 = require("crypto-js/enc-utf8");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "auto-encrypt" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let onCommand_1 = vscode.commands.registerCommand('auto-encrypt.decrypt', decryptCurrentEditor);
    let onCommand_2 = vscode.commands.registerCommand('auto-encrypt.encrypt', encrypt);


	const onSave = vscode.workspace.onWillSaveTextDocument(async (event) => {

		// Prevent run command without active TextEditor
		if (!vscode.window.activeTextEditor) {
			return null;
		}

		const document = event.document;
		const filepath = document.uri.fsPath;
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        const workspace = workspaceFolder ? workspaceFolder.uri.fsPath : filepath;
        if(filepath.indexOf('.encrypt')!== -1) {
            return;
        }
        const urlFormatted = filepath.replace(/\\/g, '/');
        const lastPart = urlFormatted.split('/').pop();
        const encrypt_uri = workspace + '\\' + lastPart + '.encrypt';
        const origin_text = document.getText();
        const encrypt_text = AES.encrypt(origin_text,'1111').toString();
        const bytes   = AES.decrypt('U2FsdGVkX1/LMpvJrnD3ukmAfC1Um33SQXj7Tm2O7f0=','11121');
        var originalText = bytes.toString(enc_utf8);
        console.log(originalText);
        fs.writeFileSync(encrypt_uri, encrypt_text);


        const text = await vscode.workspace.openTextDocument(encrypt_uri);
        vscode.window.showTextDocument(text);

        // const uri = vscode.Uri.file(encrypt_uri);
        // let success = await vscode.commands.executeCommand('vscode.open', uri);
        // vscode.TextEdit.replace(undefined, '11111');
    });


    vscode.workspace.onDidOpenTextDocument(async TextDocument => {
        const { fileName } = TextDocument;
        let encryptText;
        try {
            encryptText = await vscode.workspace.openTextDocument(fileName + '.encrypt');
        } catch(e) {
            // 文件不存在，不处理，啥都不做
            return;
        }
        const text = decryptTextDoc(encryptText);
        console.log(text);

        fs.writeFileSync(fileName, text);
        // e.edit(function (edit) {
        //   for (var x = 0; x < selections.length; x++) {
        //     let selection: vscode.Selection = selections[x];
        //     let txt: string;
        //     if(selection.isEmpty) {
        //       return;
        //     } else {
        //       txt = d.getText(new Range(selection.start, selection.end));
        //       const newText = replacer.replace('${word}', txt);
        //       edit.replace(selection, newText);
        //     }
        //   }
        // });

    });

    context.subscriptions.push(onCommand_1);
    context.subscriptions.push(onCommand_2);
    context.subscriptions.push(onSave);

}

// this method is called when your extension is deactivated
export function deactivate() {
}