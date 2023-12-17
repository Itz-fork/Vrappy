import {
	Input,
	Select,
	Toggle,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { setup_env } from "./helpers/envs.ts";
import { regexes } from "./helpers/regex.ts";
import { Summarizer } from "./plugins/summarizer.ts";

async function ask() {
	// Get path to video file and validates it
	let upath = await Input.prompt("Which video you want me to summarize?");
	let path = { where: upath, from: "none" };

	if (upath.match(regexes.youtube)) {
		path.from = "youtube";
	} else if (upath.match(regexes.file_path)) {
		path.from = "file";
	} else {
		console.log("Sorry, only yotube and local videos are supported!");
		Deno.exit(1);
	}

	// Method
	const method = await Select.prompt({
		message: "Which method should I use?",
		options: [
			{ name: "Subtitles", value: "sub" },
			{ name: "Audio", value: "audio" },
		],
	});

	// Save options
	const save = await Toggle.prompt("Should I save the result to a file?");

	return { path, method, save };
}

async function run() {
	const { path, method, save } = await ask();
	let resp = await Summarizer.sums(path, method, save);
	console.clear();
	console.log(resp);
}

await setup_env();
await run();
