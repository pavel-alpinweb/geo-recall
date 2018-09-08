import {changeClass} from './utils.js';
import renderFn from './templates/template.hbs';
const source = document.querySelector('.friends-catalog__list--friends');
const target = document.querySelector('.friends-catalog__list--filter');
export function storageLoader(){

function getObject(key){
    let returnObj = JSON.parse(localStorage.getItem(key));
    return returnObj;
}
function render(array,container){
    const html = renderFn({ items: array });
    container.innerHTML = html;
    const cards = target.querySelectorAll('.friend-card__control');
    for (const costyle of cards) { // Игорь прости меня за мой код :( 
        changeClass(costyle,'friend-card__control--remove','friend-card__control--add');
    }
}
render(getObject('freinds'),source);
render(getObject('filter'),target);
}