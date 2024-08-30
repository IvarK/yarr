import { list } from './functions/list.js';
import { search } from './functions/search.js'
import { watch } from './functions/watch.js';

(async () => {
    const [, , command] = process.argv;

    switch (command) {
        case "add": return search();
        case "list": return list();
        case "watch": {
            const [, , , tag] = process.argv;
            return watch(tag);
        }
    }

    console.log(`No such command found: ${command}`)
})();