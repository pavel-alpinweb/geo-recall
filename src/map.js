import "./styles/styles.scss";
import { isMatching } from "./utils.js";
import { changeClass } from "./utils.js";
import { addRecall } from "./recall.js";
import { showRecall } from "./recall.js";

const recallWindow = document.querySelector('#recall');
const map = document.querySelector('#map');
const close = document.querySelector('.close');
const address = document.querySelector('.address');
const recallList = document.querySelector(".recall__list");

export function showWindow(){
    let windowWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    let windowHeight = window.innerHeight 
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    let coordsX = event.clientX > windowWidth - 379 ? event.clientX - 389 + "px" : event.clientX + "px";
    let coordsY = event.clientY + 538 > windowHeight ? windowHeight - 538 + "px" : event.clientY + "px";

    // function coordsY(){
    //     if (event.clientY > windowHeight - 500) {
    //         return event.clientY - 500 + "px";
    //     } else if(event.clientY < windowHeight - 500){
    //         return event.clientY + "px";
    //     } else {
    //         return event.clientY + "px";
    //     }
    // }

    recallWindow.classList.remove('hide');
    recallWindow.style.left = coordsX;
    recallWindow.style.top = coordsY;
    console.log(windowHeight);
    console.log(event.clientY > windowHeight - 500);
    console.log(event.clientY);
    console.log(coordsY);
}

ymaps.ready(init);
function init() {  
    var myMap = new ymaps.Map('map', {
            center: [55.753994, 37.622093],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        });

    const clusterer = new ymaps.Clusterer({ 
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5
    });
    myMap.geoObjects.add(clusterer);

    close.addEventListener('click',()=>{
        recallWindow.classList.add('hide'); 
        recallList.innerHTML = '';
    });


    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        recallList.innerHTML = '';
        let coords = e.get('coords');
        getAddress(coords);
        showWindow();
    });

    addRecall(myMap,clusterer);
    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            let addressText = firstGeoObject.getAddressLine();
            address.innerHTML = addressText;
        });
    }

    showRecall(myMap);
}