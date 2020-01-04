import * as vscode from 'vscode';

export class Logit {
    public static current: Logit;

    private readonly panel: vscode.WebviewPanel;
	private readonly extensionPath: string;
	// private readonly dataSource: DataSource;
    private disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
        this.panel = panel;
        this.extensionPath = extensionPath;
        let workspaceFolders = vscode.workspace.workspaceFolders;
        // this.update

    }

    public static unfold(extensionPath: string) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        // if (Logit.current) {
        //     Logit.current.panel.reveal(column);
        //     return;
        // }

        let panel = vscode.window.createWebviewPanel('Logit', 'Git Log', vscode.ViewColumn.Beside);
        let cc = vscode.comments.createCommentController('as', 'sd');
        Logit.current = new Logit(panel, extensionPath);
        console.log('column:' + column);
    }
}