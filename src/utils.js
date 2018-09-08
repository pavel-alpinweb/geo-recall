export const consoleLogHelper = () => {
  console.log('Im helper! From utils.js');
}

export const consoleLogHelper2 = () => {
  console.log('Im helper number 2! From utils.js');
}

export function isMatching(full, chunk) {
  if (full.indexOf(chunk) > -1) {
     return true;
  }
  return false;
}

export function changeClass(element,add,remove){
  element.classList.add(add); 
  element.classList.remove(remove);  
}