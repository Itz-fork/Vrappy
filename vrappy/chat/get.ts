import { OpenAI, toFile } from "https://deno.land/x/openai@v4.20.1/mod.ts";
import { createReadStream } from "https://deno.land/std@0.153.0/node/fs.ts";
import { type Transcription } from "https://deno.land/x/openai@v4.20.1/resources/audio/transcriptions.ts";
import { db_get } from "../helpers/setup.ts";

/**
 * Helper class used to summarize text/audio
 *
 * Limitations: 25MB audio file cap (Can be fixed by splitting audio file)
 */
const key = `${await db_get("OPENAI_KEY")}`;
class Summarizer {
	static openai = new OpenAI({ apiKey: key });

	public static async summarize_from_txt(sub: string | Transcription) {
		console.log(`${async () => {
			return await db_get("OPENAI_KEY");
		}}`);
		let opcc = await this.openai.chat.completions.create({
			model: "gpt-3.5-turbo-16k",
			messages: [{
				role: "assistant",
				content: `Summarize this: ${sub}`,
			}],
		});
		let resp = opcc.choices[0].message.content?.toString();
		await Deno.writeFile(
			`${Deno.cwd()}/summarized.txt`,
			new TextEncoder().encode(resp),
		);
		return resp;
	}

	public static async summarize_from_audio(path: string) {
		let file = await toFile(createReadStream(path));
		let resp = await this.openai.audio.transcriptions.create(
			{ file: file, model: "whisper-1", response_format: "text" },
		);
		return await this.summarize_from_txt(resp);
	}
}

export { Summarizer };
