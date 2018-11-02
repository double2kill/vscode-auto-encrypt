'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import decrypt from './commands/decrypt'
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
    let onCommand = vscode.commands.registerCommand('auto-encrypt.decrypt', decrypt);

	const onSave = vscode.workspace.onWillSaveTextDocument((event) => {

		// Prevent run command without active TextEditor
		if (!vscode.window.activeTextEditor) {
			return null;
		}

		const document = event.document;
		const filepath = document.uri.fsPath;
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
		const workspace = workspaceFolder ? workspaceFolder.uri.fsPath : filepath;
        const urlFormatted = filepath.replace(/\\/g, '/');
        const lastPart = urlFormatted.split('/').pop();
        const encrypt_uri = workspace + '\\' + lastPart + '.encrypt';
        const origin_text = document.getText();
        const encrypt_text = AES.encrypt(origin_text,'1111').toString();
        const bytes   = AES.decrypt('U2FsdGVkX1/LMpvJrnD3ukmAfC1Um33SQXj7Tm2O7f0=','11121');
        var originalText = bytes.toString(enc_utf8);
        console.log(originalText)
        fs.writeFileSync(encrypt_uri, encrypt_text);
        // vscode.TextEdit.replace(undefined, '11111');
	});
    context.subscriptions.push(onCommand);
    context.subscriptions.push(onSave);
}

// this method is called when your extension is deactivated
export function deactivate() {
}