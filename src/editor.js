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
            backgroundColor: 'var(--tp-container-background-color, rgba(20,20,25,0.98))',
            zIndex: '9998',
            display: 'none',
            flexDirection: 'column',
            padding: '10px',
            boxSizing: 'border-box',
            color: 'var(--tp-input-foreground-color, white)',
            boxShadow: '-5px 0 15px rgba(0,0,0,0.5)'
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
            this.pane.expanded = true; // Re-expand PowerBoost when editor is closed
        });
        header.appendChild(closeBtn);

        // Create editor container (to hold line numbers and textarea)
        const editorContainer = document.createElement('div');
        Object.assign(editorContainer.style, {
            display: 'flex',
            width: '100%',
            height: 'calc(100% - 50px)', // Adjust height for the header
            marginBottom: '10px',
            position: 'relative',
            backgroundColor: 'var(--tp-input-background-color, rgba(25,25,35,0.97))',
            border: '1px solid var(--tp-input-background-color-focus, rgba(0,0,0,0.7))',
            borderRadius: '4px',
            overflow: 'hidden'
        });
        this.fullscreenEditor.appendChild(editorContainer);

        // Create line numbers
        const lineNumbers = document.createElement('div');
        Object.assign(lineNumbers.style, {
            width: '40px',
            height: '100%',
            backgroundColor: 'var(--tp-input-background-color-active, rgba(0,0,0,0.6))',
            color: 'var(--tp-input-foreground-color, rgba(255,255,255,0.5))',
            padding: '8px 0',
            textAlign: 'right',
            fontFamily: 'monospace',
            fontSize: '14px',
            userSelect: 'none',
            overflowY: 'hidden',
            borderRight: '1px solid var(--tp-input-background-color-focus, rgba(0,0,0,0.7))'
        });
        editorContainer.appendChild(lineNumbers);

        // Create textarea
        const textarea = document.createElement('textarea');
        textarea.value = this.codeState.value;
        Object.assign(textarea.style, {
            width: 'calc(100% - 40px)',
            height: '100%',
            backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.95)',
            border: 'none',
            padding: '8px',
            resize: 'none',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.4',
            outline: 'none'
        });
        
        // Function to update line numbers
        const updateLineNumbers = () => {
            const lines = textarea.value.split('\n');
            lineNumbers.innerHTML = lines.map((_, i) => 
                `<div style="padding-right: 8px; height: 1.4em;">${i + 1}</div>`
            ).join('');
        };

        textarea.addEventListener('input', () => {
            this.codeState.value = textarea.value;
            updateLineNumbers();
        });
        
        textarea.addEventListener('scroll', () => {
            lineNumbers.scrollTop = textarea.scrollTop;
        });

        // Initial line numbers
        updateLineNumbers();
        
        editorContainer.appendChild(textarea);

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
            backgroundColor: 'var(--tp-input-background-color, rgba(25,25,35,0.97))',
            color: 'var(--tp-input-foreground-color, white)',
            border: '1px solid var(--tp-input-background-color-focus, rgba(0,0,0,0.7))',
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
        
        // Initial output
        updateOutput();
        
        // Update textarea when state changes externally
        setInterval(() => {
            if (textarea.value !== this.codeState.value) {
                textarea.value = this.codeState.value;
                updateLineNumbers();
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