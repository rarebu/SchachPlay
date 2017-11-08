var size = 9
var blocksize =3


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

var gameJson = {
    0: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    1: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9} ,
    2: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    3: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    4: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    5: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    6: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    7: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
    8: {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9},
};

function fillGrid() {
    for (var scalar=0; scalar <81;scalar++) {
            console.log( "Scalar" + scalar+":" + row(scalar) );
            $("#scalar"+scalar).html(gameJson[row(scalar)][col(scalar)]);
    }
}



$( document ).ready(function() {
    console.log( "Document is ready, filling grid" );
    fillGrid();
    $("#scalar1").html(gameJson[1][1]);
});


