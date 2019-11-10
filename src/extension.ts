// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-toolbox" is now active!');

	context.subscriptions.push(registerCommand('extension.helloWorld'));
	context.subscriptions.push(registerDataConvertCommand(',', 'extension.csv2table'));
}

function registerDataConvertCommand(separator: string, commandName: string): vscode.Disposable {
	let disposable = vscode.commands.registerCommand(commandName, () => {
		vscode.window.showInformationMessage('Hello World!');
	});
	return disposable
}

function registerCommand(commandName: string): vscode.Disposable {
	let disposable = vscode.commands.registerCommand(commandName, () => {
		vscode.window.showInformationMessage('Hello World!');
	});
	return disposable
}

// this method is called when your extension is deactivated
export function deactivate() {}
