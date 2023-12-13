import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";


const kv = await Deno.openKv();

async function setup_env() {
    // await kv.delete(["OPENAI_KEY"])

    // Set cwd
    await kv.set(["VRAPPY_DIR"], `${Deno.cwd()}/.vrappy/`);
    // Set api key
    if (!(await kv.get(["OPENAI_KEY"])).value) {
        let tOKy = await Input.prompt("Enter your OpenAI key")
        await kv.set(["OPENAI_KEY"], tOKy);
    }
}

async function db_get(key: string) {
    let val = await kv.get([key])
    return val.value
}

await setup_env()

export {setup_env, db_get}
