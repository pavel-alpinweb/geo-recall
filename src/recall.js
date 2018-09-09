const recallAuthor = document.querySelector('#name');
const recallPlace = document.querySelector('#place');
const recallText = document.querySelector('#text');
const addRecallButton = document.querySelector('#add-recall');
const recallForm = document.querySelector('.recall__form');


export function addRecall(coords,map){
    addRecallButton.addEventListener('click',()=>{
        let recallAuthorVal = recallAuthor.value;
        let recallPlaceVal = recallPlace.value;
        let recallTextVal = recallText.value;

        const review = {
            place: recallPlaceVal,
            user: recallAuthorVal,
            review: recallTextVal
        }

        recallForm.reset();

        const placemark = new ymaps.Placemark(coords, {
            hintContent: 'Содержимое подсказки',
            baloonContent: 'Содержимое балуна'
        });
        

        placemark.properties.set('id', Date.now());
        placemark.properties.set('review', review);
        placemark.properties.set('type', 'placemark');

        map.geoObjects.add(placemark);

        console.log(placemark.properties.get('id'));
        console.log(placemark.properties.get('review'));
    });
}

export function showRecall(map){
    map.geoObjects.events.add('click', e => {
        console.log('Marker clicked!');
        const target = e.get('target');
        const { properties } = target;
        if (properties.get('type') !== 'placemark') return;
    
        console.log(properties.get('id'));
        console.log(properties.get('review'));
      });
}