import * as vscode from 'vscode';

export async function showPreviewPanel(content: string) {

  const document =await vscode.workspace.openTextDocument({ language: 'javascript', content });
  await vscode.window.showTextDocument(document, 2, true);
}