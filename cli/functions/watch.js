import { client } from "./client.js";
import cliProgress from "cli-progress";
import colors from 'ansi-colors';
import { wait } from "../utils.js";
import { filesize } from "filesize";

const getTorrent = async tag => {
  const torrents = await client.torrents.info({
    tag: tag.replace(/ /g, "_"),
    limit: 1
  });

  if (torrents.length === 0) {
    console.log("\nTorrent not found! It might be completed already.")
    return null;
  }

  return torrents[0];
} 

export const watch = async (tag) => {
  if (!(await getTorrent(tag))) return;

  const bar = new cliProgress.SingleBar({
    format: `${colors.cyan('{bar}')} {percentage}% | ${colors.blue('{downloaded}/{filesize} - {speed}')} | ETA: {eta_formatted} | Status: {status} -- ${colors.green('{title}')}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: null,
  }, cliProgress.Presets.shades_classic)

  bar.start(1, 0)

  while (true) {
    const t = await getTorrent(tag);
    if (!t) {
      bar.stop();
      break;
    }

    bar.update(t.progress, {
      speed: `${filesize(t.dlspeed)}/s`,
      title: t.name,
      status: t.state,
      percentage: t.progress.toFixed(2),
      filesize: filesize(t.size),
      downloaded: filesize(t.downloaded)
    })

    if (t.progress === 1) {
      bar.stop()
      console.log("Torrent completed downloading!")
      break;
    }

    await wait(1000);
  }
}