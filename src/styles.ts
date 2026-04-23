import * as vscode from 'vscode';
import { Repo } from './git'
import { dedent } from './codeblock';

export type Path = string & { readonly __brand: "Path" };
export function asPath(str: string): Path { return str as Path; }


export type LineRange = [number, number?];
export function linesFromSelection(selection: vscode.Selection) : LineRange {
    const start = selection.start.line + 1;
    const end = selection.end.line + 1;
    return selection.isSingleLine ? [start] : [start, end] ;
}

export interface ReferenceMetadata {
    path: Path;
    repo?: Repo;
    hash?: string;
    context: string;
    lines: LineRange;
    lang: string;
    code?: string;
}

export interface IReferenceStrategy {
    generate(data: ReferenceMetadata): string;
    formatLines(lines: LineRange): string;
    // TODO: add repo details interface
}



export function standardFormatLines(lines: LineRange): string {
        const start = lines[0];
        const end = lines[1];
        return lines[1] ? `L${start}-L${end}` : `L${start}`;
}

class Standard implements IReferenceStrategy {
    generate(data: ReferenceMetadata): string {
        if (data.repo) {
            return [
                `PATH: ${data.path}`,
                `REPO: ${data.repo} (ref: ${data.hash})`,
                `CONTEXT: ${data.context} [${this.formatLines(data.lines)}]`
            ].join('\n');
        } else {
            return [
                `PATH: ${data.path}`,
                `CONTEXT: ${data.context} [${this.formatLines(data.lines)}]`
            ].join('\n');
        }
    }

    formatLines(lines: LineRange): string {
        return standardFormatLines(lines);
    }
}

class GitHubLink implements IReferenceStrategy {
    generate(data: ReferenceMetadata): string {
        // TODO: create function that can make link for different online repo hosts
        /// We will only support links in https
        const repoDetails = data.repo ? `https://${data.repo}/blob/${data.hash}/` : `local-repo/`;
        const url = `${repoDetails}${data.path}#${this.formatLines(data.lines)}`;
        return `${url}\n${data.context}`;
    }
    formatLines(lines: LineRange): string {
        return standardFormatLines(lines);
    }
}

class Minimalist implements IReferenceStrategy {
    generate(data: ReferenceMetadata): string {
        const repoDetails = data.repo ? `${data.repo} (${data.hash}) :: ` : ``;
        return `${repoDetails}${data.path} :: ${data.context} (${this.formatLines(data.lines)})`;
    }

    formatLines(lines: LineRange): string {
        return standardFormatLines(lines);
    }
}

export class ReferenceEngine {
    private readonly strategies: Record<string, IReferenceStrategy> = {
        "Standard": new Standard(),
        "GitHubLink": new GitHubLink(),
        "Minimalist": new Minimalist(),
    };
    private readonly strategy: IReferenceStrategy;

    constructor(strategyName?: string) {
        this.strategy = (strategyName && this.strategies[strategyName])
            || this.strategies["Standard"];
    }

    public getOutput(data: ReferenceMetadata): string {
        let output = this.strategy.generate(data);

        if (data.code) {
            const processed = dedent(data.code);
            output += `\n\n\`\`\`${data.lang}\n${processed}\n\`\`\``;
        }
        return output;
    }
}
