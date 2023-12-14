import {
	Input,
	Select,
	Toggle,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { setup_env } from "./helpers/envs.ts";
import { regexes } from "./helpers/regex.ts";
import { Ytdl } from "./plugins/ytdl.ts";
import { ffmpeg } from "./plugins/ffmpeg.ts";
import { Summarizer } from "./chat/get.ts";
import { parse_srt } from "./helpers/parser.ts";

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

async function summarize_from_yt(
	url: string,
	method: string,
	save: boolean,
) {
	if (method == "sub") {
		let yt_sresp = await Ytdl.extract_sub(url);
		return await Summarizer.summarize_from_txt(yt_sresp, save);
	} else {
		let yt_aresp = await Ytdl.extract_audio(url);
		return await Summarizer.summarize_from_audio(yt_aresp, save);
	}
}

async function summarize_from_local(
	path: string,
	method: string,
	save: boolean,
) {
	if (method == "sub") {
		let esf = await ffmpeg.extract_sub(path);
		let lc_sresp = await parse_srt(path = esf);
		return await Summarizer.summarize_from_txt(lc_sresp, save);
	} else {
		let lc_aresp = await ffmpeg.extract_audio(path);
		return await Summarizer.summarize_from_audio(lc_aresp, save);
	}
}

async function run() {
	const { path, method, save } = await ask();
	let resp;

	if (path.from == "youtube") {
		resp = await summarize_from_yt(path.where, method, save);
	} else {
		resp = await summarize_from_local(path.where, method, save);
	}
}

await setup_env();
await run();
