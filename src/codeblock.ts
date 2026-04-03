export function dedent(text: string): string {
    const lines = text.split(/\r?\n/);
    
    const minIndent = lines.reduce((min, line) => {
        if (line.trim().length === 0) return min;
        const match = line.match(/^[ \t]*/);
        const indent = match ? match[0].length : 0;
        return Math.min(min, indent);
    }, Infinity);

    if (minIndent === Infinity || minIndent === 0) return text;

    return lines
        .map(line => line.length >= minIndent ? line.substring(minIndent) : line)
        .join('\n');
}