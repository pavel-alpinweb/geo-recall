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

    if(recallAuthorVal == '' || recallPlaceVal == '' || recallTextVal == ''){
      alert('Все поля должны быть заполнены');
      return;
    }

    function getCoords(text) {
      ymaps.geocode(text).then(function(res) {
        let firstGeoObject = res.geoObjects.get(0);
        let addressText = firstGeoObject.geometry.getCoordinates();
        const dateNow = new Date();
        const review = {
            place: recallPlaceVal,
            user: recallAuthorVal,
            review: recallTextVal,
            time: `${dateNow.getDate()}.${dateNow.getUTCMonth() + 1}.${dateNow.getFullYear()}`,
            id: placemarkId++,
            costyle: address.innerHTML
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
    placemark = target;
    const costyle = target.properties.get("review")[0].costyle;
    const address = document.querySelector(".address");
    console.log(costyle);
    address.innerHTML = costyle;
    if (target.properties.get("type") !== "placemark") return;
    showWindow();
    render(placemarkArray,recallList);
  });
}

body.addEventListener('click',(e)=>{
  if (e.target.classList.contains('placemarkLink')) {
    const placemarkId = e.target.getAttribute('data-id');
    placemark = placemarkArray[placemarkId];
    const costyle = placemark.properties.get("review")[0].costyle;
    const address = document.querySelector(".address");
    console.log(costyle);
    address.innerHTML = costyle;
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
      }
    }
    const html = renderFn({ items: outArray });
    container.innerHTML = html;
}