/**
 * Helper function to parse srt into a paragraph
 */
async function parse_srt({ sub, fpath }: { sub?: string; fpath?: string }) {
	let str = fpath ? await Deno.readTextFile(`${fpath}`) : sub ? sub : "";
	if (fpath) {
		sub = await Deno.readTextFile(`${fpath}`);
	}
	// remove timestamps, new lines
	let parsed = str.replace(/(\d|:|-->|,)|(<[^>]*>)|(\n)/g, "");
	// remove additional whitespaces
	parsed = parsed.replace(/(\s\s)/g, " ");
	return parsed;
}

export { parse_srt };
