import { Util } from "./util.js";
import { Categories } from "./categories.js";
import { Editor } from "./editor.js";
import { Search } from "./search.js";

export class Powerboost {
    constructor() {
        this.pane = null;
        this.editor = null;
        this.categories = null;
        this.search = null;
    }

    async init() {
        try {
            await this.loadBoostlet();

            // Create main Tweakpane instance
            this.pane = new window.Pane({
                container: document.body,
                title: 'PowerBoost 😎',
                expanded: true,
            });

            this.pane.registerPlugin(TweakpaneSearchListPlugin);
            this.pane.registerPlugin(TextareaPlugin)

            // Position the pane
            const paneElement = this.pane.element;
            Object.assign(paneElement.style, {
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                zIndex: '9999'
            });

            // Initialize Boostlet
            Boostlet.init();

            // Initialize components
            this.search = new Search(this.pane);
            await this.search.init();

            this.categories = new Categories(this.pane);
            await this.categories.init();

            this.editor = new Editor(this.pane);
            this.editor.init();

        } catch (error) {
            console.error('Error in Powerboost init:', error);
            throw error;
        }
    }

    loadBoostlet() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://mpsych.github.io/boostlet/dist/boostlet.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}