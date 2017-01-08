/*
 * board.js
 * 
 * This file contains the "Object" that represents the entire Catan board.
 */
 
var board_config = {
    Tile_values: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12],
    Resource_list: ['Woestijn',  // Must always be the first!
                     'Bremsenspriets', 'Bremsenspriets', 'Bremsenspriets', 'Bremsenspriets',
                     'Ziptie', 'Ziptie', 'Ziptie', 'Ziptie',
                     'Alu_7075', 'Alu_7075', 'Alu_7075',
                     'Carbon', 'Carbon', 'Carbon', 'Carbon',
                     'Rozebutt', 'Rozebutt', 'Rozebutt'],
    nb_tiles: 19,
    // 0 Starts outside, circulating to the center. Should be in-sync with the serial protocol.
    adjecent_tiles: {
      0  : [     1,   11, 12],
      1  : [ 0,  2,   12, 13], 
      2  : [ 1,  3,   13],
      3  : [ 2,  4,   13, 14],
      4  : [ 3,  5,   14],
      5  : [ 4,  6,   14, 15],
      6  : [ 5,  7,   15],
      7  : [ 6,  8,   15, 16],
      8  : [ 7,  9,   16],
      9  : [ 8, 10,   16, 17],
      10 : [ 9, 11,   17],
      11 : [10, 12,   0, 17],
      12 : [11, 13,   0, 1, 17, 18],
      13 : [12, 14,   1, 2, 3, 18],
      14 : [13, 15,   3, 4, 5, 18],
      15 : [14, 16,   5, 6, 7, 18],
      16 : [15, 17,   7, 8, 9, 18],
      17 : [16, 18,   9, 10, 11, 12],
      18 : [17,       12, 13, 14, 15, 16],
    },
    // If the tile number is 6 or 8, it is not allowed to be adjecent to another tile that has number 6 or 8.
    disallow_adjecent: [6, 8]
}
 
function board() {
    // Application Constructor
    this.tiles = [];
    this.board_type = "random"; // Start with the easiest to generate...
    
    this.initialize_random = function() {
        var now = new Date();
        var seed = now.valueOf();
        //Math.seedrandom(seed);
        
        while(!this._verify_random()){
            this.tiles = []
            var tile_values = board_config.Tile_values.slice(0);
            var tile_resources = board_config.Resource_list.slice(0);
            this._shuffle_array(tile_values);
            // Get the woestijn out of the resources before shuffling
            var woestijn = tile_resources[0];
            tile_resources = tile_resources.splice(1);
            this._shuffle_array(tile_resources);
            // Put the woestijn at the place of value 0.
            var woestijnplace = tile_values.indexOf(0);
            tile_resources = tile_resources.slice(0, woestijnplace).concat([woestijn].concat(tile_resources.slice(woestijnplace)));
            
            for(var tile_idx=0; tile_idx < tile_values.length; tile_idx++) {
                var tile_value = tile_values[tile_idx];
                var tile_resource = tile_resources[tile_idx];
                this.tiles.push(new tile(tile_value, tile_resource));
            }
        }
        console.log("Board generated!");
        console.log(this.tiles);
    }
    
    /* Kang from https://github.com/Daplie/knuth-shuffle */
    this._shuffle_array = function(array) {
        var currentIndex = array.length
        var temporaryValue
        var randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    }
    
    this._verify_random = function() {
        if(this.tiles.length != board_config.nb_tiles)
            return false;
        
        for(var tile_id = 0; tile_id < this.tiles.length; tile_id++) {
            var tile = this.tiles[tile_id];
            if(board_config.disallow_adjecent.includes(tile[0])) {
                for(var tile_adjecent_id = 0; 
                        tile_adjecent_id < board_config.adjecent_tiles[tile_id].length; 
                        tile_adjecent_id++){
                    tile_adjecent = board_config.adjecent_tiles[tile_id][tile_adjecent_id];
                    if(board_config.disallow_adjecent.includes(this.tiles[tile_adjecent][0])){
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    /** Updates the LED state.
     *      @param highlight_number:    If equal to our own number, highlight the tile.
     *      @param highlight_resource:  If equal to our own resource, highlight the tile.
     *      @param place:               If evaluates to true, highlight all tiles a little bit.
    **/
    this.update_state = function(highlight_number, highlight_resource, place){
        for(var tileidx = 0; tileidx<this.tiles.length; tileidx++){
            tile = this.tiles[tileidx];
            tile.update_state(highlight_number, highlight_resource, place=false);
        }
    }
};
