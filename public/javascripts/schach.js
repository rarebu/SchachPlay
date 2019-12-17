let size = 8


function toScalar(rowIter, colIter) {
    return rowIter*size + colIter;
}

function row(scalar) {
    return Math.floor(scalar / size);
}

function col(scalar) {
    return (scalar % size);
}

let figures = new Map([['blackRook','♜'],['blackKnight','♞'],['blackBishop','♝'],['blackQueen','♛'],['blackKing','♚'],['blackPawn','♟'],
    ['whiteRook','♖'],['whiteKnight','♘'],['whiteBishop','♗'],['whiteQueen','♕'],['whiteKing','♔'],['whitePawn','♙']]);

function isBlack(isBlack) {
    if (isBlack) return "black";
    else return "white";
}
function jsonFiguretoFigure(input) {
    return figures.get((isBlack(input.isBlack) + input.kind));
}
let tmpToChange = ""

function chooseFigure(index) {
    let figure = tmpToChange.split("")[index];
    console.log(figure + " was choosed");
    $.get({
        url: "/choose/"+figure,
        success: console.log("Set figure on Server"),
        //wech
        async: false
    });
    location.replace(location.origin);
}

function appendButton(item, index) {
    return "<div id='figure" + index + "' class='btn btn-primary' > " + item + " </div>";
}

class Grid {
    constructor(){
        this.cells = [];
        this.toChange = "";
    }

    fill(json) {
        for (let iter=0; iter < json.size;iter++) {
            let row = json.figurePositions[iter].row
            let col = json.figurePositions[iter].col
            this.cells[toScalar(row,col)]=(jsonFiguretoFigure(json.figurePositions[iter]));
        }
    }

    handleToChange(json) {
        if(json !== "") {
            console.log("Show changeable figures: " + json);
            let html = "<label> Please choose a figure:</label> <div class='btn-group'>";
            tmpToChange = json;
            html = html + json.split('').map((char, index) => appendButton(char, index)).join('');
            html = html + "</div>";
            console.log(html);
            $("div.pagecontainer").html(html);
            for (let index=0; index < 4;index++) {
                $("#figure"+index).click(function() {chooseFigure(index)});
            }
        }
    }

    updateGameStatus(message) {
        $("#gamestatus").html(message);
    }
}

let grid = new Grid()

function updateGrid(grid) {
    for (let scalar=0; scalar <size*size;scalar++) {
        let tmp = grid.cells[scalar];
        if ( typeof tmp === "undefined" ) tmp = "";
        $("#scalar"+scalar).html(tmp);
    }
}

let clickBuffer = null

function gotClick(scalar) {
    if (clickBuffer === null) {
        clickBuffer = scalar;
        console.log("Got click and stored it: " + scalar);
    }
    else {
        console.log("Got click and moved from: " + clickBuffer + ", to: " + scalar);
        setCellOnServer(row(clickBuffer), col(clickBuffer), row(scalar), col(scalar));
        clickBuffer = null;
    }
}

function registerClickListener() {
    for (let scalar=0; scalar <size*size;scalar++) {
        $("#scalar"+scalar).click(function() {gotClick(scalar)});
    }
}

function setCellOnServer(row, col, newRow, newCol) {
    $.get("/move/"+row+"/"+col+"/"+newRow+"/"+newCol, function (data) {
        console.log("Set move on Server")
    });
}

function loadJson() {
    $.ajax({
        method: "GET",
        url: "/json",
        dataType: "json",

        success: function (result) {
            console.log("Load field");
            grid = new Grid();
            grid.fill(result.field)
            grid.handleToChange(result.field.toChange)
            updateGrid(grid);
            registerClickListener();
            grid.updateGameStatus(result.message);

        }
    })
}

function connectWebSocket() {
    var websocket = new WebSocket("ws://localhost:9000/websocket");
    websocket.setTimeout;

    websocket.onopen = function () {
        console.log("Connected to Websocket");
    };

    websocket.onclose = function () {
        console.log('Connection with Websocket Closed!');
    };

    websocket.onerror = function (error) {
        console.log('Error in Websocket Occured: ' + error);
    };

    websocket.onmessage = function (e) {
        console.log('Got event from server');
        if (typeof e.data === "string") {
            console.log('Data was sent');
            let json = JSON.parse(e.data);
            grid = new Grid();
            grid.fill(json.field);
            grid.handleToChange(json.field.toChange)
            updateGrid(grid);
            grid.updateGameStatus(json.message);
        }

    };
}

$( document ).ready(function() {
    console.log( "Document is ready, filling grid" );
    loadJson();
    connectWebSocket();
});


