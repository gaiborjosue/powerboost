const moduleScript = document.createElement('script');
moduleScript.type = 'module';
moduleScript.textContent = `
    import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';
    import * as TextareaPlugin from 'https://cdn.jsdelivr.net/npm/@pangenerator/tweakpane-textarea-plugin@2.0.0/dist/tweakpane-textarea-plugin.min.js';
    import * as TweakpaneSearchListPlugin from 'https://cdn.jsdelivr.net/npm/tweakpane-plugin-search-list@0.0.10/dist/tweakpane-plugin-search-list.min.js';

    // Make Pane globally available
    window.Pane = Pane;
    window.TextareaPlugin = TextareaPlugin;
    window.TweakpaneSearchListPlugin = TweakpaneSearchListPlugin;

    
    // Now load PowerBoost
    const powerboostScript = document.createElement('script');
    powerboostScript.type = 'module';
    //powerboostScript.src = 'http://localhost:5500/dist/powerboost.min.js';
    powerboostScript.src = 'https://gaiborjosue.github.io/powerboost/dist/powerboost.min.js';
    document.head.appendChild(powerboostScript);
`;
document.head.appendChild(moduleScript);