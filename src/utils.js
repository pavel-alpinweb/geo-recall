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