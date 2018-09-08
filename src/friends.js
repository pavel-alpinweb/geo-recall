import './styles/styles.scss';
import {isMatching} from './utils.js';
import {changeClass} from './utils.js';
import {secret} from './secret.js';
import {vkLoader} from './vk-loader.js';
import {saving} from './save.js';
import {storageLoader} from './storage-loader.js';

const localValueFriends = localStorage.getItem('freinds');
const localValueFilter = localStorage.getItem('filter');

const source = document.querySelector('.friends-catalog__list--friends');
const target = document.querySelector('.friends-catalog__list--filter');

const friendSeacrhInput = document.getElementById('accaunt-friends');
const filterSeacrhInput = document.getElementById('list-friends');

secret();

if(localValueFriends && localValueFilter){
  storageLoader();
} else {
  vkLoader();
}

addSearchHandler(friendSeacrhInput);
addSearchHandler(filterSeacrhInput);

makeDnD([source, target]);

document.body.addEventListener('click',e=>{
  if (e.target.classList.contains('btn-save')) {
    saving();
    alert('Ваша сортировка сохраненна');
  }
  if (e.target.classList.contains('friend-card__control')) {
    sortEngine(e.target);
  }
});


function makeDnD(zones) {
  let currentDrag;

  zones.forEach(zone => {
      zone.addEventListener('dragstart', e => {
            currentDrag = { source: zone, node: e.target};
      });
      zone.addEventListener('dragover', e => {
          e.preventDefault();

      });

      zone.addEventListener('drop', e => {
          if (currentDrag) {
              e.preventDefault();
              if (currentDrag.source !== zone) {
                  if (e.target.classList.contains('friends-card')) {
                      zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
                  } else {
                      zone.insertBefore(currentDrag.node, zone.firstElementChild);
                  }

                  if (currentDrag.node.parentNode.classList.contains('friends-catalog__list--filter')) {
                    const icon = currentDrag.node.querySelector('.friend-card__control');
                    changeClass(icon,'friend-card__control--remove','friend-card__control--add');

                    let searchValue = filterSeacrhInput.value.toLowerCase();
                    searchEngine(target,searchValue);
                  } else {
                    let searchValue = friendSeacrhInput.value.toLowerCase();
                    searchEngine(source,searchValue);

                    const icon = currentDrag.node.querySelector('.friend-card__control');
                    changeClass(icon,'friend-card__control--add','friend-card__control--remove');
                  }
              }
              currentDrag = null;
          }
      });
  })
}

function sortEngine(element){
  if (element.classList.contains('friend-card__control--add')) {
    changeClass(element,'friend-card__control--remove','friend-card__control--add');
  } else {
    changeClass(element,'friend-card__control--add','friend-card__control--remove');
  }
  const currentZome = element.parentNode.parentNode;
  if (currentZome.classList.contains('friends-catalog__list--filter')) {
    source.insertBefore(element.parentNode, source.lastElementChild);
    let searchValue = friendSeacrhInput.value.toLowerCase();
    searchEngine(source,searchValue);
  } else {
    target.insertBefore(element.parentNode, target.firstElementChild);
    let searchValue = filterSeacrhInput.value.toLowerCase();
    searchEngine(target,searchValue);
  }
}

function searchEngine(list,inputValue){
  for (const card of list.children ) {
    let firstName = card.getAttribute('data-firstname').toLowerCase();
    let lastName = card.getAttribute('data-lastname').toLowerCase();

    if (isMatching(`${firstName} ${lastName}`, inputValue)) {
      card.classList.remove('hide');
    } else{
      card.classList.add('hide');
    }
  }
}

function addSearchHandler(input){
  input.addEventListener('input',e=>{
    let searchValue = input.value.toLowerCase();

    if(input.id == friendSeacrhInput.id){
      searchEngine(source,searchValue);
    } else if(input.id == filterSeacrhInput.id){
      searchEngine(target,searchValue);
    }
  });
}