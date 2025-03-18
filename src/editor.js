export class Editor {
    constructor(pane) {
        this.pane = pane;
        this.codeFolder = null;
        this.codeState = {
            value: 'Boostlet.init();\nconsole.log(Boostlet.framework.name);',
            output: ''
        };
        this.fullscreenEditor = null;
    }

    init() {
        // Create Code Editor folder
        this.codeFolder = this.pane.addFolder({
            title: 'Code Editor',
            expanded: false
        });

        // Add button to open full-screen editor
        this.codeFolder.addButton({
            title: 'Open Code Editor'
        }).on('click', () => this.openFullscreenEditor());

        // Add run button in the folder
        this.codeFolder.addButton({
            title: 'Run Code'
        }).on('click', () => this.runCode());

        // Add output binding
        this.codeFolder.addBinding(this.codeState, 'output', {
            label: 'Output',
            multiline: true,
            rows: 6,
            readonly: true
        });
    }

    openFullscreenEditor() {
        // Create editor container if it doesn't exist
        if (!this.fullscreenEditor) {
            this.createFullscreenEditor();
        }
        
        // Show the editor
        this.fullscreenEditor.style.display = 'flex';
        
        // Collapse PowerBoost pane
        this.pane.expanded = false;
    }

    createFullscreenEditor() {
        // Create container
        this.fullscreenEditor = document.createElement('div');
        document.body.appendChild(this.fullscreenEditor);
        
        // Style container
        Object.assign(this.fullscreenEditor.style, {
            position: 'fixed',
            top: '0',
            right: '0',
            width: '40%',
            height: '100%',
            backgroundColor: 'var(--tp-container-background-color, rgba(0,0,0,0.8))',
            zIndex: '9998',
            display: 'none',
            flexDirection: 'column',
            padding: '10px',
            boxSizing: 'border-box',
            color: 'var(--tp-input-foreground-color, white)'
        });

        // Create header
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
        });
        this.fullscreenEditor.appendChild(header);

        // Create title
        const title = document.createElement('h3');
        title.textContent = 'Code Editor';
        Object.assign(title.style, {
            margin: '0',
            color: 'var(--tp-input-foreground-color, white)'
        });
        header.appendChild(title);

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            background: 'var(--tp-button-background-color, white)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '18px',
            width: '30px',
            height: '30px'
        });
        closeBtn.addEventListener('click', () => {
            this.fullscreenEditor.style.display = 'none';
        });
        header.appendChild(closeBtn);

        // Create textarea
        const textarea = document.createElement('textarea');
        textarea.value = this.codeState.value;
        Object.assign(textarea.style, {
            width: '100%',
            height: 'calc(70% - 20px)',
            backgroundColor: 'var(--tp-input-background-color, rgba(0,0,0,0.3))',
            color: 'var(--tp-input-foreground-color, white)',
            border: '1px solid var(--tp-input-background-color-focus, rgba(0,0,0,0.5))',
            borderRadius: '4px',
            padding: '8px',
            marginBottom: '10px',
            resize: 'none',
            fontFamily: 'monospace',
            fontSize: '14px'
        });
        textarea.addEventListener('input', () => {
            this.codeState.value = textarea.value;
        });
        this.fullscreenEditor.appendChild(textarea);

        // Create run button
        const runBtn = document.createElement('button');
        runBtn.textContent = 'Run Code';
        Object.assign(runBtn.style, {
            backgroundColor: 'var(--tp-button-background-color, white)',
            color: 'var(--tp-button-foreground-color, black)',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer',
            marginBottom: '10px'
        });
        runBtn.addEventListener('click', () => this.runCode());
        this.fullscreenEditor.appendChild(runBtn);

        // Create output area
        const output = document.createElement('div');
        Object.assign(output.style, {
            width: '100%',
            height: '30%',
            backgroundColor: 'var(--tp-input-background-color, rgba(0,0,0,0.3))',
            color: 'var(--tp-input-foreground-color, white)',
            border: '1px solid var(--tp-input-background-color-focus, rgba(0,0,0,0.5))',
            borderRadius: '4px',
            padding: '8px',
            overflow: 'auto',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
        });
        this.fullscreenEditor.appendChild(output);

        // Update output when state changes
        const updateOutput = () => {
            output.textContent = this.codeState.output;
        };
        
        // Set up a MutationObserver to watch for changes to this.codeState.output
        const observer = new MutationObserver(() => {
            updateOutput();
        });
        
        // Initial output
        updateOutput();
        
        // Update textarea when state changes externally
        setInterval(() => {
            if (textarea.value !== this.codeState.value) {
                textarea.value = this.codeState.value;
            }
            updateOutput();
        }, 100);
    }

    runCode() {
        try {
            // Capture console.log output
            const originalLog = console.log;
            let output = '';
            console.log = (message) => {
                output += message + '\n';
                originalLog(message);
            };

            // Run the code
            eval(this.codeState.value);

            // Update output and restore console.log
            this.codeState.output = output;
            console.log = originalLog;
        } catch (e) {
            this.codeState.output = e.toString();
        }
    }
}