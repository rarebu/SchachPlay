
let size = 9
let blocksize = 3

function toScalar(house, cell) {
    return house*size + cell;
}

function row(scalar) {
    return ((scalar % size) /blocksize) + (blocksize * (scalar /(size*blocksize)));
}

function col(scalar) {
    return (scalar %blocksize) + (blocksize *(scalar/size)) - (size*(scalar/(size*blocksize)));
}

let x = toScalar(3,4);
alert(x );
//alert(row(x));
//alert(col(x));

if (window.console) {
  console.log("Welcome to HTWG Sudoku");
}
