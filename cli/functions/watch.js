import { client } from "./client.js";
import cliProgress from "cli-progress";
import colors from 'ansi-colors';
import { wait } from "../utils.js";
import { filesize } from "filesize";

export const watch = async (tag) => {
  const bar = new cliProgress.SingleBar({
    format: `${colors.cyan('{bar}')} {percentage}% | {speed} | Status: {status} -- ${colors.green('{title}')}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  }, cliProgress.Presets.shades_classic)

  bar.start(1, 0)

  while (true) {
    const torrents = await client.torrents.info({
      tag: tag.replace(/ /g, "_"),
      limit: 1
    });

    if (torrents.length === 0) {
      bar.stop()
      console.log("\nTorrent not found! It might be completed already.")
      break;
    }

    const t = torrents[0];

    bar.update(t.progress, {
      speed: `${filesize(t.dlspeed)}/s`,
      title: t.name,
      status: t.state
    })

    if (t.progress === 1) {
      bar.stop()
      console.log("Torrent completed downloading!")
      break;
    }

    await wait(1000);
  }
}