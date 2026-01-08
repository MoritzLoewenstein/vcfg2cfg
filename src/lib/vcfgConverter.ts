export interface ParsedVcfg {
	convars?: Record<string, string>;
	bindings?: Record<string, string>;
}

export function parseVcfg(content: string): ParsedVcfg {
	const result: ParsedVcfg = {};

	// Remove comments and extra whitespace
	const lines = content
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('//'));

	let currentSection: string | null = null;
	let currentData: Record<string, string> = {};

	for (const line of lines) {
		if (line === '{') continue;
		if (line === '}') {
			if (currentSection) {
				result[currentSection as keyof ParsedVcfg] = currentData;
				currentSection = null;
				currentData = {};
			}
			continue;
		}

		// Check if this is a section header (e.g., "convars" or "bindings")
		if (line.startsWith('"') && line.endsWith('"') && !line.includes('\t')) {
			currentSection = line.replace(/"/g, '');
			continue;
		}

		// Parse key-value pairs (separated by tabs or spaces)
		if (currentSection) {
			const match = line.match(/^"([^"]+)"\s+"([^"]*)"/);
			if (match) {
				const [, key, value] = match;
				currentData[key] = value;
			}
		}
	}

	return result;
}

export function vcfgToCfg(vcfgContent: string, fileName: string): string {
	const rows: string[] = [];
	rows.push(`// From: ${fileName}`);

	try {
		const config = parseVcfg(vcfgContent);

		if (config.convars) {
			// Convert convars: key "value"
			Object.entries(config.convars).forEach(([key, value]) => {
				rows.push(`${key} "${value}"`);
			});
		}

		if (config.bindings) {
			// Convert bindings: bind "key" "command" or unbind "key"
			Object.entries(config.bindings).forEach(([key, value]) => {
				if (value === '<unbound>') {
					rows.push(`unbind "${key}"`);
				} else {
					rows.push(`bind "${key}" "${value}"`);
				}
			});
		}
	} catch (error) {
		console.error(`Error parsing ${fileName}:`, error);
	}

	rows.push('');
	return rows.join('\n');
}
