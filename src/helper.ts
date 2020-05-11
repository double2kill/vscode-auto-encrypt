
import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from 'path';
import * as micromatch from 'micromatch'

export function isEncryptFile (filePath: string): boolean {
  return path.extname(filePath) === '.encrypt';
}

export function isOriginFile (filePath: string): boolean {
  return !isEncryptFile(filePath);
}

export async function isTargetFile (TextDocument: vscode.TextDocument) {
  const filePath = TextDocument.uri.fsPath;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(TextDocument.uri);
  const workspace = workspaceFolder ? workspaceFolder.uri.fsPath : filePath;

  // TODO 考虑是否有必要每次都去读取配置文件？是否可以通过监控encryptrc变化来更新文件配置
  // NOTE .encryptrc格式要和.gitignore相同, 后期考虑增强格式
  let encryptrc;
  const encryptFilePath = path.join(workspace, '.encryptrc');
  try {
    encryptrc = fs.readFileSync(encryptFilePath, {
      encoding:'utf-8'
    });
  } catch (e) {
    // 文件不存在，不处理，啥都不做
    return false;
  }
  const targetFiles = encryptrc.split('\n')
    .map(item => item.trim())
    .filter(item => !!item);
  
  const { fileName } = TextDocument;
  const relativePath = path.relative(workspace, fileName);
  const a = micromatch([relativePath], targetFiles, { basename: true });

  return a.length;
}

export function getOriginFile(filePath: string) {

}