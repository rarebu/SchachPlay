let sudokuHighlightButtons =[{text: "None", link: "/highlight/0"}]
for(let index=1; index <=9; index++){
    sudokuHighlightButtons.push({text: index, link: "/highlight/"+index})
}

$(document).ready(function () {

    var sudokuVueMenu = new Vue({
        el: '#sudoku-vue-menu',
        data: {
            menuItems: sudokuHighlightButtons
        }
    })


    var sudokuGame = new Vue({
        el:'#sudoku-game'
    })

})



Vue.component('sudoku-highlight-button-bar', {
    template:`
        <div class="buttonbarcontainer">
            <label>
                Highlight
            </label>
            <div  class=" btn-group" >
                <a v-for="item in menuItems" v-bind:href="item.link" class="btn btn-primary"> {{item.text}} </a>
            </div>
        </div>
    `,
    data: function () {
        return {
            menuItems: sudokuHighlightButtons
        }
    },

})

