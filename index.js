import { search } from './functions/search.js'

(async () => {
    const [,,type, searchTerm] = process.argv;

    search(searchTerm, type);
})();