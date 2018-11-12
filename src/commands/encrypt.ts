'use strict';

import * as vscode from 'vscode';
import fs = require('fs');
var AES = require("crypto-js/aes");
var enc_utf8 = require("crypto-js/enc-utf8");

export default (textEditor: vscode.TextEditor) => {

  // Prevent run command without active TextEditor
  if (!vscode.window.activeTextEditor) {
    return null;
  }

  const document = textEditor.document;
  const filePath = document.uri.fsPath;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const workspace = workspaceFolder ? workspaceFolder.uri.fsPath : filePath;
  const urlFormatted = filePath.replace(/\\/g, '/');
  const lastPart = urlFormatted.split('/').pop();
  const encrypt_uri = workspace + '\\' + lastPart + '.encrypt';
  const origin_text = document.getText();
  const encrypt_text = AES.encrypt(origin_text,'1111').toString();
  const bytes   = AES.decrypt('U2FsdGVkX1/LMpvJrnD3ukmAfC1Um33SQXj7Tm2O7f0=','11121');
  var originalText = bytes.toString(enc_utf8);
  console.log(originalText);
  fs.writeFileSync(encrypt_uri, encrypt_text);
};