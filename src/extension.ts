'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PickImg } from './PickImg';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed;
export function activate(context: vscode.ExtensionContext) {
    // PickImg.autoUpdateBackground();
    // PickImg.stopBackground()
    let startCommand = vscode.commands.registerCommand('extension.backgroundCover.start', () => { PickImg.autoUpdateBackground(); });
    let stopCommand  = vscode.commands.registerCommand('extension.backgroundCover.stop',  () => { PickImg.stopBackground(); });
    context.subscriptions.push(startCommand);
    context.subscriptions.push(stopCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
    // PickImg.stopBackground();
}