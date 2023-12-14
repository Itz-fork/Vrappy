/**
 * Helper function to parse srt into a paragraph
 */
async function parse_srt(
	sub = "",
	path: string | undefined = undefined,
) {
	if (path) {
		sub = await Deno.readTextFile(`${path}`);
	}
	// remove timestamps, new lines
	let parsed = sub.replace(/(\d|:|-->|,)|(<[^>]*>)|(\n)/g, "");
	// remove additional whitespaces
	parsed = parsed.replace(/(\s\s)/g, " ");
	return parsed;
}

export { parse_srt };
