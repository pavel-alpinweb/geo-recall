import { showWindow } from "./map.js";
import renderFn from './templates/template.hbs';

const recallAuthor = document.querySelector("#name");
const recallPlace = document.querySelector("#place");
const recallText = document.querySelector("#text");
const addRecallButton = document.querySelector("#add-recall");
const recallForm = document.querySelector(".recall__form");
const recallList = document.querySelector(".recall__list");

export function addRecall(map) {
  addRecallButton.addEventListener("click", () => {
    const recallAuthorVal = recallAuthor.value;
    const recallPlaceVal = recallPlace.value;
    const recallTextVal = recallText.value;
    const address = document.querySelector(".address");
    const review = {
      place: recallPlaceVal,
      user: recallAuthorVal,
      review: recallTextVal
    };

    function getCoords(text) {
      ymaps.geocode(text).then(function(res) {
        let firstGeoObject = res.geoObjects.get(0);
        let addressText = firstGeoObject.geometry.getCoordinates();

        const placemark = new ymaps.Placemark(addressText, {
          hintContent: "Содержимое подсказки",
          baloonContent: "Содержимое балуна"
        });

        const oldReviews = placemark.properties.get("review")
          ? placemark.properties.get("review")
          : [];

        oldReviews.push(review);

        console.log(oldReviews);

        placemark.properties.set("id", Date.now());
        placemark.properties.set("review", oldReviews);
        placemark.properties.set("type", "placemark");

        map.geoObjects.add(placemark);
        render(placemark.properties.get('review'),recallList);

        recallForm.reset();
      });
    }
    getCoords(address.innerHTML);
  });
}

export function showRecall(map) {
  map.geoObjects.events.add("click", e => {
    const target = e.get("target");
    const { properties } = target;
    if (properties.get("type") !== "placemark") return;
    showWindow();
    render(properties.get('review'),recallList);
  });
}


function render(array,container){
    const html = renderFn({ items: array });
    container.innerHTML = html;
}