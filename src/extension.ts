// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Parser from './converter/csv2table/Parser';
import TableFormatter from './converter/csv2table/TableFormatter';
import { Logit } from './logit';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-toolbox" is now active!');

	// context.subscriptions.push(registerCommand('extension.helloWorld'));
	// context.subscriptions.push(registerDataConvertCommand(',', 'extension.csv2table'));
	context.subscriptions.push(vscode.commands.registerCommand('extension.logit', () => {
		Logit.unfold(context.extensionPath);
		vscode.window.showInformationMessage('Logit!');
	}));

	let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
	statusBarItem.text = 'Logit';
	statusBarItem.tooltip = 'Show Git Log';
	statusBarItem.command = 'extension.logit';
	context.subscriptions.push(statusBarItem);
	statusBarItem.show();
}

function registerDataConvertCommand(separator: string, commandName: string): vscode.Disposable {
	let disposable = vscode.commands.registerCommand(commandName, async function() {

		let editor = vscode.window.activeTextEditor;
		if (editor) {
			
			let document = editor.document;
			let selection = editor.selection;
			if (selection.isEmpty) {
				selection = new vscode.Selection(document.positionAt(0), document.positionAt(document.getText().length));	
			}
			let text = document.getText(selection);

			let parser = new Parser(text, separator);
			let records = parser.getRecords();

			let formatter = new TableFormatter();
			let formattedResult = formatter.getFormattedTable(records);

			const newDoc = await vscode.workspace.openTextDocument({
				content: formattedResult
			});
			vscode.window.showTextDocument(newDoc, vscode.ViewColumn.Active);
		}
	});
	return disposable
}

// function registerCommand(commandName: string): vscode.Disposable {
// 	let disposable = vscode.commands.registerCommand(commandName, () => {
// 		vscode.window.showInformationMessage('Hello World!');
// 	});
// 	return disposable
// }

// this method is called when your extension is deactivated
export function deactivate() {}
