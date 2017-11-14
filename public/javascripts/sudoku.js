let size = 9
let blocksize =3


function toScalar(house, cell) {
    return house*size + cell;
}

function row(scalar) {
    return (Math.floor((scalar % size) /blocksize)) + (blocksize * Math.floor((scalar /(size*blocksize))));
}

function col(scalar) {
    return (scalar %blocksize) + (blocksize *Math.floor((scalar/size))) - (size*Math.floor((scalar/(size*blocksize))));
}

function cell(houseIndex, cellIndex) {
    return row(toScalar(houseIndex,cellIndex)),col(toScalar(houseIndex,cellIndex))
}

let gameJson = {
    size:9,
    0: {0:0,1:2,2:0,3:4,4:5,5:0,6:7,7:8,8:9},
    1: {0:1,1:0,2:3,3:0,4:5,5:6,6:7,7:8,8:9} ,
    2: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    3: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    4: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    5: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    6: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    7: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    8: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
};

class Grid {
    constructor(size){
        this.size = size;
        this.cells = [];
    }

    fill(json) {
        for (let scalar=0; scalar <this.size*this.size;scalar++) {
            this.cells[scalar]=(json[row(scalar)][col(scalar)]);
        }
    }
}

let grid = new Grid(gameJson.size)
grid.fill(gameJson)

function fillGrid(grid) {
    for (let scalar=0; scalar <grid.size*grid.size;scalar++) {
        if (grid.cells[scalar] != 0) {
            $("#scalar"+scalar).html(grid.cells[scalar]);
        }
    }
}

function showCandidates(scalar) {
    let html =""
    for (let candidateIndex=1; candidateIndex <= size;candidateIndex++) {
        html = html + " <div class='candidatecell' onclick='setCell("+scalar+","+candidateIndex+")'> " +candidateIndex + "</div>"
        if (candidateIndex % blocksize == blocksize) html = html + "<div class='clear'></div>"
    }
    $("#scalar"+scalar).html(html)
}

function setCell(scalar, value) {
    console.log("Setting cell " + scalar + " to " + value);
    grid.cells[scalar] = value;
    $("#scalar"+scalar).html(" "+grid.cells[scalar]);
    $("#scalar"+scalar).off("click");

}

function registerClickListener() {
    for (let scalar=0; scalar <grid.size*grid.size;scalar++) {
        if (grid.cells[scalar] == 0) {
            $("#scalar"+scalar).click(function() {showCandidates(scalar)});
        }
    }
}

$( document ).ready(function() {
    console.log( "Document is ready, filling grid" );
    fillGrid(grid);
    registerClickListener();

});


