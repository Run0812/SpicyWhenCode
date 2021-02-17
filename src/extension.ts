import * as vscode from 'vscode';
import {fromEventPattern} from 'rxjs';
import { SpicyCode } from "./spicyCode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "spicy-when-code" is now active!');
	let spicyCode = new SpicyCode(vscode.workspace.onDidChangeTextDocument);
	context.subscriptions.push(spicyCode);
	spicyCode.start();

	context.subscriptions.push(vscode.commands.registerCommand('spicy-when-code.helloWorld', () => vscode.window.showInformationMessage('Fuck U from SpicyWhenCode!')));
	context.subscriptions.push(vscode.commands.registerCommand('spicy-when-code.start', () => spicyCode.start()));
	context.subscriptions.push(vscode.commands.registerCommand('spicy-when-code.exit', () => spicyCode.exit()));
	context.subscriptions.push(vscode.commands.registerCommand('spicy-when-code.dispose', () => spicyCode.dispose()));

}

// this method is called when your extension is deactivated
export function deactivate() {}
