import ora from 'ora';
import api from './api.js';

(async () => {
    const [,,type, searchTerm] = process.argv;

    if (type !== "movie" && type !== "series" && type !== "other") {
        console.log("You can only search for movie, series or other!")
        return;
    }

    const spinner = ora(`Searching for ${searchTerm}.`);
    spinner.spinner = 'shark';
    spinner.start();

    const searchId = await api.post('search/start', { pattern: searchTerm })
    spinner.stop();
})();


// const spinner = ora('Loading unicorns').start();

// setTimeout(() => {
// 	spinner.color = 'yellow';
// 	spinner.text = 'Loading rainbows';
// }, 1000);