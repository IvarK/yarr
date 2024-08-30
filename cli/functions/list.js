import { filesize } from 'filesize';
import { client } from './client.js'
import Table from 'cli-table3';

export const list = async () => {
  const torrents = await client.torrents.info();

  const table = new Table({
    head: ['Name', 'Status', 'Progress', 'DL speed', 'Downloaded', 'Category', 'Tags'],
    colWidths: [50],
    wordWrap: true
  })

  torrents.forEach(t => table.push([
    t.name,
    t.state,
    `${(t.progress * 100).toFixed(2)}%`,
    `${filesize(t.dlspeed)}/s`,
    `${filesize(t.downloaded)} / ${filesize(t.size)}`,
    t.category,
    decodeURIComponent(t.tags)
  ]));

  console.log(table.toString());
}