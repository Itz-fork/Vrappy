import { vwd } from "../helpers/envs.ts";


/**
 * ffmpeg cli wrapper
 * 
 * used to extract audio and subtitles from local videos
 */
export class ffmpeg {
  static srtOut = "fm_srt_out.srt";
  static audOut = "fm_vid_out.mp3";


    /**
     * extract_audio
     *  - Extract audio from a video
     * @returns file path
     */
    public static async extract_audio(input: string) {
        let outp = `${vwd}${this.audOut}`
        const cmd = `-i ${input} -map 0:a ${outp}`.split(" ")
        await this.run_sh(cmd)
        return outp
    }

    /**
     * extract_sub
     *  - Extract subtitles from a video (limited to first sub for now)
     * @returns file path
     */
    public static async extract_sub(input: string) {
        let outp = `${vwd}${this.srtOut}`
        const cmd = `-i ${input} -map 0:s:0 ${outp}`.split(" ")
        await this.run_sh(cmd)
        return outp
    }

    private static async run_sh(cmd: string[]) {
        // To overwrite the outputs
        cmd.push("-y")
        const tout = await new Deno.Command("ffmpeg", {args: cmd}).output()

        // Handle errors
        if (tout.success != true) {
            console.log(`Vreflector: ffmpeg\nError: ${new TextDecoder().decode(tout.stderr)}`)
        }
    }
}