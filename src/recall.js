import { showWindow } from "./map.js";
import renderFn from './templates/template.hbs';

const recallAuthor = document.querySelector("#name");
const recallPlace = document.querySelector("#place");
const recallText = document.querySelector("#text");
const addRecallButton = document.querySelector("#add-recall");
const recallForm = document.querySelector(".recall__form");
const recallList = document.querySelector(".recall__list");
const body = document.body;

let placemark;

export function addRecall(map,cluster) {
  addRecallButton.addEventListener("click", () => {
    const recallAuthorVal = recallAuthor.value;
    const recallPlaceVal = recallPlace.value;
    const recallTextVal = recallText.value;
    const address = document.querySelector(".address");
    

    function getCoords(text) {
      ymaps.geocode(text).then(function(res) {
        let firstGeoObject = res.geoObjects.get(0);
        let addressText = firstGeoObject.geometry.getCoordinates();

        const review = {
            place: recallPlaceVal,
            user: recallAuthorVal,
            review: recallTextVal,
            id: Date.now(),
            time: Date.now()
        };

        placemark = new ymaps.Placemark(addressText, {
            balloonContentHeader: review.place,
            balloonContentBody: `${review.review} <br> <a href="#" class="placemarkLink" data-id="${review.id}">${address.innerHTML}</a>`,
            balloonContentFooter: review.time,
            placemarkId: review.id
          },{
            openBalloonOnClick: false
          }
        );
        
        placemark.properties.set("type", "placemark");  

        const oldReviews = placemark.properties.get("review")
          ? placemark.properties.get("review")
          : [];

        oldReviews.push(review);
        placemark.properties.set("review", oldReviews);
        map.geoObjects.add(placemark);
        cluster.add(placemark);
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

body.addEventListener('click',(e)=>{
  if (e.target.classList.contains('placemarkLink')) {
    const placemarkId = e.target.getAttribute('data-id');
    console.log(placemarksArray);
  }
});


function render(array,container){
    const html = renderFn({ items: array });
    container.innerHTML = html;
}