export class Search {
    constructor(pane) {
        this.pane = pane;
        this.examples = new Map();
        this.repoOwner = 'mpsych';
        this.repoName = 'boostlet';
        this.folderPath = 'examples';
        this.apiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${this.folderPath}`;
        
        this.state = {
            selectedExample: ''
        };
    }

    async init() {
        // Create Search folder
        const searchFolder = this.pane.addFolder({
            title: 'Search',
            expanded: true
        });

        // Fetch all examples first
        const examples = await this.fetchAllExamples();
        
        // Create options object for search-list
        const options = examples.reduce((acc, example) => {
            acc[example] = example;
            return acc;
        }, {});

        // Add search input using search-list plugin
        searchFolder.addBinding(this.state, 'selectedExample', {
            view: 'search-list',
            label: 'Example',
            options: options,
            noDataText: 'No examples found',
            debounceDelay: 250
        }).on('change', (ev) => {
            if (ev.value) {
                this.loadExample(ev.value);
            }
        });
    }

    async fetchAllExamples() {
        try {
            const response = await fetch(this.apiUrl);
            const files = await response.json();
            const examples = [];

            await Promise.all(files.map(async (file) => {
                if (file.type === "file" && file.name.endsWith(".js")) {
                    const fileName = file.name;
                    const fileNameEdit = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.'));
                    examples.push(fileNameEdit);
                }
            }));

            return examples;

        } catch (error) {
            console.error('Error fetching examples:', error);
            return [];
        }
    }

    loadExample(exampleName) {
        const baseUrl = 'https://boostlet.org/examples/';
        const script = document.createElement('script');
        script.src = `${baseUrl}${exampleName.replace(/\s+/g, '').toLowerCase()}.js`;
        document.head.appendChild(script);
    }
}