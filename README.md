# Yarr

This is a combination of a docker-compose file and a CLI-tool for finding and downloading torrents.

It uses three docker containers, one for VPN, one for Jackett (for finding torrents) and one for qbittorrent.

This is of course only for downloading legal stuff like linux distros.

## Requirements

- Node 20 or higher
- Docker and docker-compose
- Account with a VPN provider [Check list of supported providers here](https://github.com/qdm12/gluetun?tab=readme-ov-file#features)

## Setup

1. Copy `gluetun.env.example` into `gluetun.env` and set environment variables according to the vpn provider of your choice, [check the list of configurations for providers here](https://github.com/qdm12/gluetun-wiki/tree/main/setup/providers).

2. Run the docker containers with `docker-compose up -d`

3. Copy the contents of [this file](https://raw.githubusercontent.com/qbittorrent/search-plugins/master/nova3/engines/jackett.py), and put them into `/opt/docker/qbittorrent-plugins/jackett.py`

4. Go to [the qBittorrent WebUI](http://localhost:8180/), login with username admin, you can get the password with `docker logs qbittorrent | grep "temporary password"`

5. In the webui, go to tools->settings->Web UI, change your password to something else (remember to save). Then copy .env.example to .env and add your qbittorrent username and password there.

6. In the top right corner of Web UI, go to Search, on the bottom right click Search Plugins, click Install new plugin and type path /plugins/jackett.py

7. [Open Jackett dashboard](http://localhost:9117/), in the "Adding a Jackett indexer in Sonarr or Radarr" section copy the API key. Add it to the config file with nano for example with `sudo nano /opt/docker/qbittorrent/qBittorrent/nova3/engines/jackett.json`

8. Also in the Jackett dashboard, add the indexers you want to search with. **You won't see any results without this**

9. **(Optional)** To make qbittorrent automatically delete torrents after it has finished downloading, go to qbittorrent webui, tools->settings->BitTorrent, in the Seeding Limits section, when total seeding time reaches 0min, then Remove torrent.

10. Then to use the cli just run `npm i` in this folder, CLI usage is explained below.

## CLI

### Set on .bashrc

If you want to have an alias so you can call the CLI from anywhere, you need to add a bash alias, for me it looks something like this: `alias torrent="node --env-file=/home/ivar/personal/yarr/.env /home/ivar/personal/yarr/cli/index.js"` but your install folder might differ. You need to point the .env file and the index.js.

The examples below assume you use this alias, but if you don't you can just replace `torrent` with `npm start`

### Searching and adding torrents

Example usage `torrent add other "arch linux"`, the second parameter "other" specifies the output folder, there are three possible ones, "movie", "series" and "other". **Only download movies and series you can legally download, [for example from here](https://archive.org/details/moviesandfilms)** You can however pretty easily modify them to your hearts content if you just search the codebase for them. It sets the category as the output folder and the search term as the tag.

After picking a torrent it will show you the progress bar for the download. You can safely CTRL+C from this, it doesn't interrupt anything meaningful.

### Listing torrents

`torrent list`, nothing much to say about that.

### Watching torrents

`torrent watch "arch linux"`, shows you a progress bar that updates every second, it searches by the tag name, which is the original search query

## Technologies

### Jackett

Jackett works as a proxy server: it translates queries from apps (Sonarr, Radarr, SickRage, CouchPotato, Mylar3, Lidarr, DuckieTV, qBittorrent, Nefarious etc.) into tracker-site-specific http queries, parses the html or json response, and then sends results back to the requesting software. This allows for getting recent uploads (like RSS) and performing searches.

### qluetun

Gluetun is a docker VPN client with compatibilities with many different VPN providers

### qBittorrent

It's qBittorrent, duh

## Troubleshooting

### No search results

- Check if the vpn is running correctly with `docker logs gluetun`.
  - Try updating your vpn list by using `docker run --rm -v /opt/docker/gluetun:/gluetun qmcgaw/gluetun update -enduser -providers <YOUR_PROVIDER>`
- Verify that you have added trackers in Jackett, you can try doing a manual search in jackett dashboard.

### Torrent errored

- Check that the output folder has sufficient permissions, they are saved under /media
