'use strict';

import * as vscode from 'vscode';
var AES = require("crypto-js/aes");
var enc_utf8 = require("crypto-js/enc-utf8");
import fs = require('fs');

export default (textEditor: vscode.TextEditor) => {
		// Prevent run command without active TextEditor
		if (!vscode.window.activeTextEditor) {
			return null;
		}

		const document = vscode.window.activeTextEditor.document;
		const filepath = document.uri.fsPath;
    const urlFormatted = filepath.replace(/\\/g, '/');
    const uri = urlFormatted.replace(/.encrypt$/, '');
    const origin_text = document.getText();
    const bytes = AES.decrypt(origin_text,'1111');
    const originalText = bytes.toString(enc_utf8);
    fs.writeFileSync(uri, originalText);
}