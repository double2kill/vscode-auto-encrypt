'use strict';

import * as vscode from 'vscode';
import fs = require('fs');
var AES = require("crypto-js/aes");
import { isEncryptFile } from '../helper';

export default async (event: vscode.TextDocumentWillSaveEvent) => {

  const { password } = vscode.workspace.getConfiguration('auto-encrypt');

  const document = event.document;
  const filePath = document.uri.fsPath;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const workspace = workspaceFolder ? workspaceFolder.uri.fsPath : filePath;
  if (isEncryptFile(filePath)) {
    // 是加密文件则不处理
    return;
  }

  const urlFormatted = filePath.replace(/\\/g, '/');
  const lastPart = urlFormatted.split('/').pop();
  const encrypt_uri = workspace + '\\' + lastPart + '.encrypt';

  const origin_text = document.getText();
  const encrypt_text = AES.encrypt(origin_text, password).toString();
  fs.writeFileSync(encrypt_uri, encrypt_text);

  const text = await vscode.workspace.openTextDocument(encrypt_uri);
  vscode.window.showTextDocument(text);

};
