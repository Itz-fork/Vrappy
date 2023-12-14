import { OpenAI, toFile } from "https://deno.land/x/openai@v4.20.1/mod.ts";
import { createReadStream } from "https://deno.land/std@0.153.0/node/fs.ts";
import { type Transcription } from "https://deno.land/x/openai@v4.20.1/resources/audio/transcriptions.ts";
import { db_get } from "../helpers/envs.ts";

// Openai api key
const key = `${await db_get("OPENAI_KEY")}`;

/**
 * Helper class used to summarize text/audio
 *
 * Limitations: 25MB audio file cap (Can be fixed by splitting audio file)
 */
class Summarizer {
	static openai = new OpenAI({ apiKey: key });

	public static async summarize_from_txt(
		sub: string | Transcription,
		save: boolean,
	) {
		console.log(`${async () => {
			return await db_get("OPENAI_KEY");
		}}`);
		let opcc = await this.openai.chat.completions.create({
			model: "gpt-3.5-turbo-16k",
			messages: [
				{
					role: "system",
					content:
						"You are an assistant that is specialized in summarizing text. When you receive text, you provide a concise and clear summary of it.",
				},
				{ role: "assistant", content: `${sub}` },
			],
		});
		let resp = opcc.choices[0].message.content?.toString();
		if (save) {
			await Deno.writeFile(
				`${Deno.cwd()}/summarized.txt`,
				new TextEncoder().encode(resp),
			);
		}
		return resp;
	}

	public static async summarize_from_audio(path: string, save: boolean) {
		let file = await toFile(createReadStream(path));
		let resp = await this.openai.audio.transcriptions.create(
			{ file: file, model: "whisper-1", response_format: "text" },
		);
		return await this.summarize_from_txt(resp, save);
	}
}

export { Summarizer };
