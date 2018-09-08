const source = document.querySelector('.friends-catalog__list--friends');
const target = document.querySelector('.friends-catalog__list--filter');
export function saving(){
    let friendsArray = []; 
    let filterArray = []; 

    function savInObj(container,array){
        let cards = container.querySelectorAll('.friends-card');
        for (const item of cards) {
            const firstName = item.getAttribute('data-firstname');
            const lastName = item.getAttribute('data-lastname');
            const avatar = item.querySelector('.friends-card__avatar').getAttribute('src');
            const friend = {
                first_name: firstName,
                last_name: lastName,
                photo_100: avatar
            }
            array.push(friend);
        }
    }

    savInObj(target,filterArray);
    savInObj(source,friendsArray);

    function saveInStorage(obj,key){
        let serialObj = JSON.stringify(obj);
        localStorage.setItem(key, serialObj);
    }

    saveInStorage(friendsArray,"freinds");
    saveInStorage(filterArray,"filter");
}