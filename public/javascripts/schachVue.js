let schachRows = [rows(0), rows(1), rows(2), rows(3),rows(4), rows(5), rows(6), rows(7)];

function rows(row) {
    let schachCols = [];
    let type;
    for (let col = 0; col < 8; col++) {
        if(row % 2 === 0) {
            if(col % 2 === 0) {
                type = "whitecell";
            } else {
                type = "blackcell";
            }
        } else {
            if(col % 2 === 0) {
                type = "blackcell";
            } else {
                type = "whitecell";
            }
        }
        schachCols.push({row: row, col: col, scalar: "scalar" + toScalar(row, col), type: type});
    }
    return schachCols;
}

$(document).ready(function () {
    console.log("Vue is loading");
    var schachGame = new Vue({
        el:'#schach-game'
    })
    console.log("Vue was loaded");
});

function toScalar(row, col) {
    return row*size + col;
}

Vue.component('schach-field', {
    template:`
        <div class="gamecontainer">
            <div class="game">
                <div v-for="row in rows" class="row">
                    <div v-for="col in row" v-bind:class="col.type" v-bind:id="col.scalar"></div>
                </div>
            </div>
        </div>
    `,
    data:function () {
        return {
            rows: schachRows
        }
    },
});