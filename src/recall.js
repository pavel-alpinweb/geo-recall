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
let placemarkId = 0;
let placemarkArray = [];

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
            time: Date.now(),
            id: placemarkId++
        };

        placemark = new ymaps.Placemark(addressText, {
            balloonContentHeader: review.place,
            balloonContentBody: `${review.review} <br> <a href="#" class="placemarkLink" data-id="${review.id}">${address.innerHTML}</a>`,
            balloonContentFooter: review.time
          },{
            openBalloonOnClick: false
          }
        );
        placemark.properties.set("type", "placemark");  

        const oldReviews = [];

        oldReviews.push(review);

        placemark.properties.set("review", oldReviews);

        map.geoObjects.add(placemark);

        cluster.add(placemark);

        placemarkArray.push(placemark);

        render(placemarkArray,recallList);

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
    placemark = target;
    render(placemarkArray,recallList);
  });
}

body.addEventListener('click',(e)=>{
  if (e.target.classList.contains('placemarkLink')) {
    const placemarkId = e.target.getAttribute('data-id');
    placemark = placemarkArray[placemarkId];
    showWindow();
    render(placemarkArray,recallList);
  }
});


function render(mainArray,container){
  let outArray = [];
    for (const placemarkMy of mainArray) {
      const myPlace = placemark.geometry.getCoordinates();
      const allPlace = placemarkMy.geometry.getCoordinates();
      if (myPlace[0] == allPlace[0] && myPlace[1] == allPlace[1]) {
        outArray = outArray.concat(placemarkMy.properties.get("review"));
        console.log(outArray);
      }
    }
    const html = renderFn({ items: outArray });
    container.innerHTML = html;
}