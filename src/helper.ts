
import * as vscode from 'vscode';

export function isEncryptFile (filePath: string) {
  return /.encrypt$/.test(filePath);
}

export function isOriginFile (filePath: string) {
  return !isEncryptFile(filePath);
}

export async function isTargetFile (TextDocument: vscode.TextDocument) {
  const filePath = TextDocument.uri.fsPath;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(TextDocument.uri);
  const workspace = workspaceFolder ? workspaceFolder.uri.fsPath : filePath;

  // TODO 考虑是否有必要每次都去读取配置文件？是否可以通过监控encryptrc变化来更新文件配置
  // NOTE .encryptrc格式要和.gitignore相同, 后期考虑增强格式
  let encryptrc;
  try {
    encryptrc = await vscode.workspace.openTextDocument(workspace + '\\.encryptrc');
  } catch (e) {
    // 文件不存在，不处理，啥都不做
    return false;
  }

  const { fileName } = TextDocument;

  encryptrc = encryptrc.getText();

  // TODO 处理文件

  const regEx = new RegExp(`${encryptrc}$`);

  return regEx.test(fileName);
}