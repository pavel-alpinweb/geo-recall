import renderFn from './templates/template.hbs';
export function vkLoader() {
VK.init({
  apiId: 6680960
});
function auth(){
    return new Promise((resolve, reject) => {
      VK.Auth.login(function(data) {
          if (data.session) {
            resolve();
          } else {
            reject(new Error('Не удалось авторизоваться'));
          }
        }, 2);
    });
}

function callAPI(method, params){
  params.v = '5.76';
  return new Promise((resolve, reject) => {
      VK.api(method, params, (data) => {
          if(data.error){
              reject(data.error);
          } else {
              resolve(data.response);
          }
      });
    });
}

auth()
  .then(() => {
      return callAPI('friends.get', {fields: 'photo_100'});
  })
  .then(friends => {
    const html = renderFn({ items: friends.items });
    const results = document.querySelector('.friends-catalog__list--friends');
    results.innerHTML = html;
  });
}
