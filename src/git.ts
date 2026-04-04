import * as vscode from 'vscode';

export type Repo = string & { readonly __brand: "Repo" };
export function asRepo(str: string): Repo { return str as Repo; }

/**
 * Grabs the repo name and short commit hash.
 */
export function getGitInfo(uri: vscode.Uri) {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    if (!gitExtension) return { repo: undefined, hash: undefined };

    const api = gitExtension.getAPI(1);
    const repo = api.getRepository(uri);
    if (!repo) return { repo: undefined, hash: undefined };

    const remote = repo.state.remotes[0]?.fetchUrl || "local";
    const hash = repo.state.HEAD?.commit?.substring(0, 7) || "unsaved";
    
    const cleanRepo = remote.replace('https://', '').replace('.git', '');
    return { repo: cleanRepo, hash };
}