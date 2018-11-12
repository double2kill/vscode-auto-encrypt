'use strict';

import * as vscode from 'vscode';
import fs = require('fs');
const AES = require("crypto-js/aes");
const enc_utf8 = require("crypto-js/enc-utf8");

export function decryptCurrentEditor (textEditor: vscode.TextEditor) {

  // Prevent run command without active TextEditor
  if (!vscode.window.activeTextEditor) {
    return null;
  }

  const document = vscode.window.activeTextEditor.document;
  const filePath = document.uri.fsPath;
  const urlFormatted = filePath.replace(/\\/g, '/');
  let uri = urlFormatted.replace(/.encrypt$/, '');
  const originalText = decryptTextDoc(document);
  fs.writeFileSync(uri, originalText);
}

export function decryptTextDoc (TextDocument: vscode.TextDocument) {
  const origin_text = TextDocument.getText();
  const bytes = AES.decrypt(origin_text, '1111');
  return bytes.toString(enc_utf8);
}