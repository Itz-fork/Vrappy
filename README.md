# Vrappy
Summarize videos using AI

## Features
- Summarize youtube videos (english only)
- Summarize local videos

> [!NOTE]
> Still in development

## Usage
```sh
git clone https://github.com/Itz-fork/Vrappy.git
cd vrappy
deno run --allow-run --allow-read --allow-write --allow-env --allow-net --unstable vrappy/cli.ts
```

## TODO

- [ ] Cleanup current UI
- [x] Support for local video files
- [ ] Support for selecting audio / subtitle track
- [ ] Caching system to reuse summarizations
- [ ] Support large audio files (> 25mb)
- [ ] Support for gpt vision