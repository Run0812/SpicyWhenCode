import * as vscode from 'vscode';
import {fromEventPattern} from 'rxjs';
import { SpicyCode } from "./SpicyCode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "spicy-when-code" is now active!');
	let spicyCode = new SpicyCode(vscode.workspace.onDidChangeTextDocument);
	context.subscriptions.push(spicyCode);
	spicyCode.subscribe();

	context.subscriptions.push(vscode.commands.registerCommand('spicy-when-code.helloWorld', () => vscode.window.showInformationMessage('Fuck U from SpicyWhenCode!')));
	context.subscriptions.push(vscode.commands.registerCommand('spicy-when-code.start', () => spicyCode.subscribe()));
	context.subscriptions.push(vscode.commands.registerCommand('spicy-when-code.exit', () => spicyCode.dispose()));


	// for test
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
