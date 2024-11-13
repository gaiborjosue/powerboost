import { Powerboost } from './powerboost.js';



// register global namespace
window.Powerboost = new Powerboost();


window.Powerboost.init().catch(error => {
    console.error('Error initializing Powerboost:', error);
});