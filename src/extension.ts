// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Subject, fromEventPattern} from 'rxjs';
import { SpicyCode } from './input_parser';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "spicy-when-code" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('spicy-when-code.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Fuck U from SpicyWhenCode!');
	});
	context.subscriptions.push(disposable);

	let spicyCode = new SpicyCode(vscode.workspace.onDidChangeTextDocument);
	context.subscriptions.push(spicyCode);



	var ob2 = fromEventPattern<vscode.TextDocumentChangeEvent>(
		vscode.workspace.onDidChangeTextDocument, 
		function(handler, disposable:vscode.Disposable) {
			disposable.dispose();
	}); // remove handler called when unsubscirbe

	
	let ob2sub = ob2.subscribe((e) => {
		console.log(e);
		
	});

	context.subscriptions.push({dispose(){
		ob2sub.unsubscribe();
	}});




}

// this method is called when your extension is deactivated
export function deactivate() {}
