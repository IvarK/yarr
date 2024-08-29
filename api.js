import axios from 'axios';

const QBITTORRENT_API = 'http://localhost:8180/api/v2/';
const { QBITTORRENT_USER, QBITTORRENT_PASSWORD } = process.env;

let sid = ''

const authorize = async () => {
    if (sid) return true;
    try {
        const response = await axios.post(
            `${QBITTORRENT_API}auth/login`,
            {
                username: QBITTORRENT_USER,
                password: QBITTORRENT_PASSWORD
            }
        );
    
        console.log(response.data)
    } catch (e) {
        console.error(e.response.statusText)
    }
};

export default {
    post: async (url, body) => {
        await authorize();
        try {
            const response = await axios.post(`${QBITTORRENT_API}${url}`, body);
            console.log(response.statusText)
            return response.data;
        } catch (e) {
            console.error(e.response.statusText)
        }
    }
}