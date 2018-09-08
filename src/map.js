import "./styles/styles.scss";
import { isMatching } from "./utils.js";
import { changeClass } from "./utils.js";

ymaps.ready(init);

function init() {
    var myPlacemark,
        myMap = new ymaps.Map('map', {
            center: [55.753994, 37.622093],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            // Слушаем событие окончания перетаскивания на метке.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });

        getAddress(coords);
    });

    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: ''
        }, {
            preset: 'islands#violetDotIconWithCaption'
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        // myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            myPlacemark.properties
                .set({
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: 
                    `
                    <div class="recall">
                    <header class="recall__header">
                        <img src="/src/img/header-marker.png" alt="marker">
                        <span class="address">${firstGeoObject.getAddressLine()}</span>
                        <div class="close">
                            <img src="/src/img/close.png" alt="close">
                        </div>
                    </header>
                    <div class="recall__content">
                        <div class="recall__list">
                            <ul>
                                <li>
                                    <span class="recall__author">svetlana</span>
                                    <span class="recall__place">Шоколадница <span class="recall__date">13.12.2015</span></span>
                                    <p class="recall__text">Очень хорошее место!</p>
                                </li>
                                <li>
                                    <span class="recall__author">svetlana</span>
                                    <span class="recall__place">Шоколадница <span class="recall__date">13.12.2015</span></span>
                                    <p class="recall__text">Очень хорошее место!</p>
                                </li>
                                <li>
                                    <span class="recall__author">svetlana</span>
                                    <span class="recall__place">Шоколадница <span class="recall__date">13.12.2015</span></span>
                                    <p class="recall__text">Очень хорошее место!</p>
                                </li>
                                <li>
                                    <span class="recall__author">svetlana</span>
                                    <span class="recall__place">Шоколадница <span class="recall__date">13.12.2015</span></span>
                                    <p class="recall__text">Очень хорошее место!</p>
                                </li>
                            </ul>
                        </div>
                        <form action="#" class="recall__form">
                            <legend>ВАШ ОТЗЫВ</legend>
                            <input placeholder="Ваше имя" type="text" name="name" id="name">
                            <input placeholder="Укажите место" type="text" name="place" id="place">
                            <textarea placeholder="Поделитесь впечатлениями" name="text" id="text"></textarea>
                            <button type="button">Добавить</button>
                        </form>
                    </div>
                </div>
                    `
                });
        });
    }
}
