
import { select } from "@topcli/prompts";
import { filesize } from "filesize";
import ora from 'ora';
import { client } from './client.js'
import { wait } from "../utils.js";
import { watch } from "./watch.js";

export const search = async () => {
    const [, , , type, term] = process.argv;
    if (type !== "movie" && type !== "series" && type !== "other") {
        console.log("You can only search for movie, series or other!")
        return;
    }

    const spinner = ora(`Searching for ${term}.`);
    spinner.spinner = 'shark';
    spinner.start();

    const id = await client.search.start(term);
    for (let i = 0; i < 20; i++) {
        const { status, total } = await client.search.status(id);
        if (status === 'Stopped') break;
        await wait(1000);
    }
    const results = await client.search.results(id);
    results.sort((a, b) => b.nbSeeders - a.nbSeeders);
    results.forEach(r => r.choiceText = `${filesize(r.fileSize)} - ${r.nbSeeders} seeding - ${r.fileName}`)
    await client.search.delete(id);
    spinner.stop();

    if (results.length === 0) {
        console.log("No results found!")
        return;
    }

    const selection = await select("Pick a torrent", {
        choices: results.map(r => r.choiceText),
        maxVisible: 8
    })

    const torrent = results.find(r => r.choiceText === selection);

    const savepath = (() => {
        if (type === 'movie') return '/downloads/movies'
        else return `/downloads/${type}`
    })()

    await client.torrents.add({
        urls: torrent.fileUrl,
        savepath,
        category: type,
        tags: term.replace(/ /g, "_")
    });

    // Give time for qbittorrent to add the torrent before watching it
    await new Promise(resolve => setTimeout(resolve, 1000))

    watch(term)
}