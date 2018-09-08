export function secret() {
  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("save")) {
      alert("Подсказка: ты уже на верном пути.");
      var cover = document.querySelector(".friends-filter");

      cover.onmousedown = function(e) {
        var coords = getCoords(cover);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;

        cover.style.position = "absolute";
        document.body.appendChild(cover);
        moveAt(e);

        cover.style.zIndex = 1000; // над другими элементами

        function moveAt(e) {
          cover.style.left = e.pageX - shiftX + "px";
          cover.style.top = e.pageY - shiftY + "px";
        }

        document.onmousemove = function(e) {
          moveAt(e);
        };

        cover.onmouseup = function() {
          document.onmousemove = null;
          cover.onmouseup = null;
        };
      };

      cover.ondragstart = function() {
        return false;
      };

      function getCoords(elem) {
        // кроме IE8-
        var box = elem.getBoundingClientRect();
        return {
          top: box.top + pageYOffset,
          left: box.left + pageXOffset
        };
      }
    }
  });
}
