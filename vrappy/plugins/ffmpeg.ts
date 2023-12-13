/**
 * ffmpeg cli wrapper
 * 
 * used to extract audio and subtitles from local videos
 */


export class ffmpeg {
  static cwd = `${Deno.env.get("VRAPPY_DIR")}`;
  static srtOut = "fm_srt_out";
  static audOut = "fm_vid_out.mp3";


    /**
     * extract_audio
     *  - Extract audio from a video
     */
    public static async extract_audio(input: string) {
        const cmd = `-i ${input} -map 0:a ${this.audOut}`.split(" ")
        await this.run_sh(cmd)
    }

    /**
     * extract_sub
     *  - Extract subtitles from a video
     */
    public static async extract_sub(input: string) {
        const cmd = `-i ${input} -map 0:s:0 ${this.srtOut}`.split(" ")
        await this.run_sh(cmd)
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

// let path = "/home/hirusha/Projects/Vreflect/test.webm"
// await ffmpeg.extract_audio(path)
// await ffmpeg.extract_sub(path)