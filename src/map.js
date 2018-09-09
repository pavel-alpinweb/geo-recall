import "./styles/styles.scss";
import { isMatching } from "./utils.js";
import { changeClass } from "./utils.js";

const recallWindow = document.querySelector('#recall');
const map = document.querySelector('#map');
const close = document.querySelector('.close');
const address = document.querySelector('.address');

ymaps.ready(init);

function init() {  
    var myPlacemark,
        myMap = new ymaps.Map('map', {
            center: [55.753994, 37.622093],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        });

    close.addEventListener('click',()=>{
        recallWindow.classList.add('hide'); 
    });

    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        // myPlacemark = createPlacemark(coords);
        // myMap.geoObjects.add(myPlacemark);
        getAddress(coords);
        showWindow();
    });

    // // Создание метки.
    // function createPlacemark(coords) {
    //     return new ymaps.Placemark(coords, {
    //         iconCaption: ''
    //     }, {
    //         preset: 'islands#violetDotIconWithCaption'
    //     });
    // }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            let addressText = firstGeoObject.getAddressLine();
            address.innerHTML = addressText;
        });
    }

    function showWindow(){
        recallWindow.classList.remove('hide');
        recallWindow.style.left = event.clientX + "px";
        recallWindow.style.top = event.clientY + "px";
    }
}
