(function hotspots() {
    "use strict";


    //default options
    var tileWidthPx = 25, tileHeightPx = 25, displayTiles = false, tiles = [], highestCount = 0,
        saveDataEndpointUrl = "http://localhost:9090/derp",
        oneFifth = 0, firstChunk = 0, secondChunk = 0, thirdChunk = 0, fourthChunk = 0;

    //functions
    var updateAllTiles, generateGrid, generateTile, setHotspotSettings, removeGrid;

    setHotspotSettings = function setHotspotSettings(settings) {
        window.hotspotSettings = {
            tileWidthPx: settings.tileWidthPx,
            tileHeightPx: settings.tileHeightPx,
            displayTiles: settings.displayTiles,
            saveDataEndpointUrl: settings.saveDataEndpointUrl
        };
    };

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
        var element = this,
            tempCount;
        element.jsObject.count++;
        tempCount = element.jsObject.count;
        updateAllTiles();
        if (tempCount > highestCount) {
            highestCount = tempCount;
            oneFifth = highestCount / 5;
            firstChunk = oneFifth;
            secondChunk = oneFifth * 2;
            thirdChunk = oneFifth * 3;
            fourthChunk = oneFifth * 4;
        }
        if (!element.jsObject.timer) {
            element.jsObject.timer = setInterval(
                function () {
                    element.jsObject.count++;
                    tempCount = element.jsObject.count;
                    updateAllTiles();

                    if (tempCount > highestCount) {
                        highestCount = tempCount;
                        oneFifth = highestCount / 5;
                        firstChunk = oneFifth;
                        secondChunk = oneFifth * 2;
                        thirdChunk = oneFifth * 3;
                        fourthChunk = oneFifth * 4;
                    }
                }, 1000);
        }
    };

    Tile.prototype.removeTimer = function () {
        clearInterval(this.jsObject.timer);
    };

    Tile.prototype.clickEvent = function (e) {
        //hide this and container element
        this.style.visibility = "hidden";
        this.parentNode.style.visibility = "hidden";

//        var elementUnderneth = document.getElementById("alink");
        var elementUnderneath = document.elementFromPoint(e.x, e.y);
        if (elementUnderneath) {
            elementUnderneath.click();
        }
        this.style.visibility = "visible";
        this.parentNode.style.visibility = "visible";
    };


    updateAllTiles = function updateAllTiles() {
        var i, tile;
        for (i = 0; i < tiles.length; i++) {

            tile = tiles[i];
            tile.tileElement.className = "tile" + (displayTiles ? "" : " hide");
            if (tile.count === 0) {
                tile.tileElement.style.backgroundColor = "#520052";
            } else if (tile.count === 1) {
                tile.tileElement.style.backgroundColor = "#751975";
            } else if (tile.count >= 2 && tile.count < firstChunk) {
                tile.tileElement.style.backgroundColor = "#000066";
            } else if (tile.count >= firstChunk && tile.count < secondChunk) {
                tile.tileElement.style.backgroundColor = "#1947D1";
            } else if (tile.count >= secondChunk && tile.count < thirdChunk) {
                tile.tileElement.style.backgroundColor = "#E6E600";
            } else if (tile.count >= thirdChunk && tile.count < fourthChunk) {
                tile.tileElement.style.backgroundColor = "#D13E19";
            } else if (tile.count >= fourthChunk) {
                tile.tileElement.style.backgroundColor = "#CC0000";
            }
        }
    };

    generateGrid = function generateGrid() {
        var body = window.document.querySelector("body");
        var container = window.document.createElement("div");

        //dynamically set the width and height of the container
        container.style.width = window.outerWidth;
        container.style.height = window.outerHeight;

        container.className = "container";
        body.insertBefore(container, body.firstChild);

        var width = window.outerWidth;
        var widthRemaining = window.outerWidth % window.hotspotSettings.tileWidthPx;

        if (widthRemaining) {
            width = window.outerWidth + (window.hotspotSettings.tileWidthPx - widthRemaining);
        }

        var height = window.outerHeight;
        var heightRemaining = window.outerHeight % window.hotspotSettings.tileHeightPx;

        if (heightRemaining) {
            height = window.outerHeight + (window.hotspotSettings.tileHeightPx - heightRemaining);
        }

        var tilesAcross = width / window.hotspotSettings.tileWidthPx;
        var tilesDown = height / window.hotspotSettings.tileHeightPx;
        var totalTiles = tilesAcross * tilesDown;
        var i;
        for (i = 0; i < totalTiles; i++) {
            container.appendChild(generateTile());
        }
    };

    generateTile = function generateTile() {
        var tile = new Tile({height: window.hotspotSettings.tileHeightPx, width: window.hotspotSettings.tileWidthPx, count: 0, showTiles: window.hotspotSettings.displayTiles})
        tiles.push(tile);
        return tile.tileElement;
    };

    removeGrid = function removeGrid() {
        var body = window.document.querySelector("body");
        var container = window.document.querySelector(".container");
        body.removeChild(container);
    };

    //function to be run by the user to customize this app
    window.createNewHotspotGrid = function createNewHotspotGrid(settings) {
        removeGrid();
        setHotspotSettings(settings);
        generateGrid();
    };


    //just before loading a new page, post tiles data to an endpoint synchronously
//    window.addEventListener('unload', function () {
//        var sendStats = new XMLHttpRequest(),
//            data;
//
//        sendStats.onreadystatechange = function sendStatsComplete() {
//            if (sendStats.readyState === 4 && sendStats.status === 200) {
//                console.log("in callback, posting of data successful");
//            }
//        };
//        sendStats.open("POST", saveDataEndpointUrl, false);
//        sendStats.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//
//        //only stringify height, width and count. done because of a circular reference in tile as 'this.tileElement.jsObject = this;'
//        data = {tilesArr: tiles, url: window.location.href};
//        sendStats.send(JSON.stringify(data, ['url', 'tilesArr', 'height', 'width', 'count']));
//    });

    //listen for certain key presses
    window.document.addEventListener("keypress", function (event) {
        console.log("key press", event.keyCode);
        if (event.ctrlKey && event.shiftKey && event.keyCode === 25) { //y
            displayTiles = !displayTiles;
            updateAllTiles();
        } else if (event.ctrlKey && event.shiftKey && event.keyCode === 5) { //e
            var containerClasses = window.document.querySelector(".container").classList;
            containerClasses.toggle("seeThrough");
        } else if (event.ctrlKey && event.shiftKey && event.keyCode === 1) { //a
            removeGrid();
        } else if (event.ctrlKey && event.shiftKey && event.keyCode === 19) { //s
            console.log("sedfsf");
        }
    }, false);


    //setup
    setHotspotSettings({tileWidthPx: tileWidthPx, tileHeightPx: tileHeightPx, displayTiles: displayTiles, saveDataEndpointUrl: saveDataEndpointUrl});
    //start
    generateGrid();
}());