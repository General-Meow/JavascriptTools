(function Hotspots() {
    "use strict";


    var tileWidthPx = 25, tileHightPx = 25, displayTiles = false, tiles = [], highestCount = 0,
        oneFith = 0, firstChunk = 0, secondChunk = 0, thirdChunk = 0, fourthChunk = 0, fithChunk = 0;


    window.document.addEventListener("keypress", function (event) {

        if (event.ctrlKey && event.shiftKey && event.keyCode === 25) {
            console.log("Ctrl+Shift+Y Clicked");
            displayTiles = !displayTiles;
            var tiles = document.getElementsByClassName("tile");

            updateAllTiles();
        }
        else if (event.ctrlKey && event.shiftKey && event.keyCode === 5) {
            updateAllTiles();
        }
    }, false);

    function Tile(obj) {
        this.height = obj.height;
        this.width = obj.width;
        this.count = obj.count;

        this.tileElement = window.document.createElement("span");

        this.tileElement.className = "tile" + (obj.showTiles ? "" : " hide");
        this.tileElement.style.width = this.width;
        this.tileElement.style.height = this.height;
        this.tileElement.onmouseover = this.incrementTileCount;
        this.tileElement.onmouseout = this.removeTimer;
        this.tileElement.onmousedown = this.clickEvent;

        //create a reference back from the tile element to this object
        this.tileElement.jsObject = this;

        return this;
    }

    Tile.prototype.incrementTileCount = function () {
        var element = this;
        element.jsObject.count++;
        var tempCount = element.jsObject.count;
        console.log(tempCount);
        updateAllTiles();
        if (tempCount > highestCount) {
            highestCount = tempCount;
            oneFith = highestCount / 5;
            firstChunk = oneFith;
            secondChunk = oneFith * 2;
            thirdChunk = oneFith * 3;
            fourthChunk = oneFith * 4;
        }
        if (!element.jsObject.timer) {
            element.jsObject.timer = setInterval(
                function () {
                    element.jsObject.count++;
                    var tempCount = element.jsObject.count;
                    updateAllTiles();

                    if (tempCount > highestCount) {
                        highestCount = tempCount;
                        oneFith = highestCount / 5;
                        firstChunk = oneFith;
                        secondChunk = oneFith * 2;
                        thirdChunk = oneFith * 3;
                        fourthChunk = oneFith * 4;
                    }
                }, 1000);
        }
    };

    Tile.prototype.removeTimer = function () {
        clearInterval(this.jsObject.timer);
    }

    Tile.prototype.clickEvent = function (e) {
        //hide this element
        this.style.visibility = "hidden";
        this.parentNode.style.visibility = "hidden";

        var elementUnderneth = document.getElementById("alink");
        console.log("derp:", elementUnderneth, e);
        elementUnderneth.click();
        this.style.visibility = "visible";
        this.parentNode.style.visibility = "visible";
    };


    var updateAllTiles = function updateAllTiles() {
        for (var i in tiles) {
            var tile = tiles[i];
            tile.tileElement.className = "tile" + (displayTiles ? "" : " hide");
            if (tile.count == 0) {
                tile.tileElement.style.backgroundColor = "#520052";
            }
            else if (tile.count == 1) {
                tile.tileElement.style.backgroundColor = "#751975";
            }
            else if (tile.count >= 2 && tile.count < firstChunk) {
                tile.tileElement.style.backgroundColor = "#000066";
            }
            else if (tile.count >= firstChunk && tile.count < secondChunk) {
                tile.tileElement.style.backgroundColor = "#1947D1";
            }
            else if (tile.count >= secondChunk && tile.count < thirdChunk) {
                tile.tileElement.style.backgroundColor = "#E6E600";
            }
            else if (tile.count >= thirdChunk && tile.count < fourthChunk) {
                tile.tileElement.style.backgroundColor = "#D13E19";
            }
            else if (tile.count >= fourthChunk) {
                tile.tileElement.style.backgroundColor = "#CC0000";
            }
        }
    }

    function generateGrid() {
        var body = window.document.querySelector("body");
        var container = window.document.createElement("div");

        //dynamically set the width and height of the container
        container.style.width = window.outerWidth;
        container.style.height = window.outerHeight;

        container.className = "container";
        body.insertBefore(container, body.firstChild);

        var width = window.outerWidth;
        var widthRemaining = window.outerWidth % tileWidthPx;

        if (widthRemaining) {
            width = window.outerWidth + (tileWidthPx - widthRemaining);
        }

        var height = window.outerHeight;
        var heightRemaining = window.outerHeight % tileHightPx;

        if (heightRemaining) {
            height = window.outerHeight + (tileHightPx - heightRemaining);
        }

        var tilesAcross = width / tileWidthPx;
        var tilesDown = height / tileHightPx;
        var totalTiles = tilesAcross * tilesDown;

        for (var i = 0; i < totalTiles; i++) {
            container.appendChild(generateTile());
        }

    }

    function generateTile() {
        var tile = new Tile({height: tileHightPx, width: tileWidthPx, count: 0, showTiles: displayTiles})
        tiles.push(tile);
        return tile.tileElement;
    }


    generateGrid();
})();