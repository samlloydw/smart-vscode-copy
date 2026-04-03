import * as vscode from 'vscode';

/**
 * Gets the Class > Method path, stripping parameters and generics.
 */
export async function getCodeContext(editor: vscode.TextEditor): Promise<string> {
    const position = editor.selection.active;
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
        'vscode.executeDocumentSymbolProvider',
        editor.document.uri
    );

    if (!symbols) return "";

    const breadcrumbs: string[] = [];
    function findRecursive(symbolList: vscode.DocumentSymbol[]) {
        for (const symbol of symbolList) {
            if (symbol.range.contains(position)) {
                const cleanName = symbol.name.split(/[<()]/)[0].trim();
                breadcrumbs.push(cleanName);
                if (symbol.children?.length) findRecursive(symbol.children);
                break;
            }
        }
    }

    findRecursive(symbols);
    return breadcrumbs.join(' > ');
}