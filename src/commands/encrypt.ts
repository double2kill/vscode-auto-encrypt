'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import fs = require('fs');
import { isEncryptFile } from '../helper';

const AES = require("crypto-js/aes");

export default async (event: vscode.TextDocumentWillSaveEvent) => {

  const { password } = vscode.workspace.getConfiguration('auto-encrypt');

  const document = event.document;
  const filePath = document.uri.fsPath;
  if (isEncryptFile(filePath)) {
    // 是加密文件则不处理
    return;
  }
  const filename = path.basename(filePath);
  const dirname = path.dirname(filePath);
  const encrypt_uri = path.join(dirname, filename + '.encrypt');

  const origin_text = document.getText();
  const encrypt_text = AES.encrypt(origin_text, password).toString();
  fs.writeFileSync(encrypt_uri, encrypt_text);

};
