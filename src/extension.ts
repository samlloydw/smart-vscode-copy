import * as vscode from 'vscode';
import * as styles from './styles';
import * as context from './context';
import * as git from './git';


/**
 * Shared logic to build and copy the string
 */
async function runCopyReference(includeCode: boolean) {
	const config = vscode.workspace.getConfiguration('reference-vscode');
	const includeGit = config.get<boolean>('includeGitInfo');
    const style = config.get<string>('referenceStyle') || "Standard";

    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const { repo, hash } = git.getGitInfo(editor.document.uri);
    const contextPath = await context.getCodeContext(editor);
    const lang = editor.document.languageId === "plaintext" ? "" : editor.document.languageId;

	const metadata: styles.ReferenceMetadata = {
        path: styles.asPath(vscode.workspace.asRelativePath(editor.document.uri)),
        repo: includeGit ? git.asRepo(repo) : undefined,
        hash: includeGit ? hash : undefined,
        context: contextPath,
        lines: styles.linesFromSelection(editor.selection),
        lang: lang,
        code: includeCode ? editor.document.getText(editor.selection) : undefined
    };

	const engine = new styles.ReferenceEngine(style);
	const finalString = engine.getOutput(metadata);
    await vscode.env.clipboard.writeText(finalString);
    vscode.window.showInformationMessage(includeCode ? 'Full reference copied' : 'Reference link copied');
}

export function activate(context: vscode.ExtensionContext) {
    // Command 1: Full
    context.subscriptions.push(
        vscode.commands.registerCommand('reference-vscode.detailed-reference', () => runCopyReference(true))
    );

    // Command 2: Lite (No code block)
    context.subscriptions.push(
        vscode.commands.registerCommand('reference-vscode.simple-reference', () => runCopyReference(false))
    );
}

export function deactivate() {}