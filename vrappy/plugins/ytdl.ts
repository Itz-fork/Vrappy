import { vwd } from "../helpers/envs.ts";


/**
 * yt-dlp cli wrapper
 * 
 * used to extract audio and subtitles from youtube videos
 */
export class Ytdl {
	static srtOut = "yt_sub_out";
	static audOut = "yt_vid_out";

	/**
	 * extractYtAudio
	 *  - extract best audio from a youtube video
	 */
	public static async extract_audio(url: string) {
		const cmd =
			`--ignore-errors --output ${vwd}/${this.audOut} --extract-audio --audio-format mp3 ${url}`
				.split(" ");
		await this.run_sh(cmd);
		return `${vwd}/${this.audOut}.mp3`
	}

	/**
	 * extractYtSub
	 *  - extract subtitle from a youtube video and returns it as a string in a readable format
	 *    english only for now
	 */
	public static async extract_sub(url: string, save: boolean | undefined) {
		const cmd =
			`--ignore-errors -S res:360 -o ${vwd}/${this.srtOut} --write-sub --write-auto-sub --sub-format ttml --convert-subs srt --skip-download ${url}`
				.split(" ");
		await this.run_sh(cmd);
		const bSrt = await Deno.readTextFile(`${vwd}/${this.srtOut}.en.srt`);
		if (save) {
			await Deno.writeFile(
				`${this.srtOut}.en.srt`,
				new TextEncoder().encode(this.parse_srt(bSrt)),
			);
		}
		return this.parse_srt(bSrt);
	}

	private static parse_srt(srt: string) {
		// remove timestamps, new lines
		let parsed = srt.replace(/(\d|:|-->|,)|(<[^>]*>)|(\n)/g, "");
		// remove additional whitespaces
		parsed = parsed.replace(/(\s\s)/g, " ");
		return parsed;
	}

	private static async run_sh(cmd: string[]) {
		const tout = await new Deno.Command("yt-dlp", { args: cmd }).output();
		// Handle errors
		if (tout.success != true) {
			console.log(
				`Vrappy: yt-dlp\nError: ${new TextDecoder().decode(tout.stderr)}`,
			);
		}
		// stdout
		// console.log(new TextDecoder().decode(tout.stdout));
		// console.log(`yt-dlp ${cmd.join(" ")}`)
	}
}
