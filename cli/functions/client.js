import { qBittorrentClient } from '@robertklep/qbittorrent';

const { QBITTORRENT_USER, QBITTORRENT_PASSWORD } = process.env;
export const client = new qBittorrentClient('http://127.0.0.1:8180', QBITTORRENT_USER, QBITTORRENT_PASSWORD);