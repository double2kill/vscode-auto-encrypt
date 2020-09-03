import * as vscode from 'vscode';
import {showDiffDetail} from '../components/showFileChangedInfo'

export function showDiff(textEditor: vscode.TextEditor) {
    // Prevent run command without active TextEditor
    if (!vscode.window.activeTextEditor) {
        return null;
    }

    const document = vscode.window.activeTextEditor.document;
    const { fileName } = document;
    showDiffDetail(fileName);
}
