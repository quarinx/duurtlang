/*
 * board.js
 *
 * This file contains the "Object" that represents the entire Catan board.
 */

var board_config = {
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
    disallow_adjecent: [6, 8],
    
    next_tiles: {
         0 : [ 1, 12],
         1 : [ 2, 13],
         2 : [ 3, 13],
         3 : [ 4, 14],
         4 : [ 5, 14],
         5 : [ 6, 15],
         6 : [ 7, 15],
         7 : [ 8, 16],
         8 : [ 9, 16],
         9 : [10, 17],
        10 : [11, 17],
        11 : [ 0, 12],
        12 : [13, 18],
        13 : [14, 18],
        14 : [15, 18],
        15 : [16, 18],
        16 : [17, 18],
        17 : [12, 18]
    },
    
    start_positions : [0, 2, 4, 6, 8, 10],
    
    // This is how this order is generated: http://xkcd.com/221/
    number_order : [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11],
    
    // This order makes more sense during debugging.
    //number_order : [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12],
    
    fixed_values : [11, 4, 0, 8, 5, 2, 6, 3, 8, 10, 9, 12, 6, 3, 10, 9, 4, 5, 11],
    fixed_resources : ['Carbon', 'Alu_7075', 'Woestijn', 'Alu_7075', 'Rozebutt',
                       'Ziptie', 'Carbon', 'Rozebutt', 'Ziptie', 'Bremsenspriets',
                       'Ziptie', 'Bremsenspriets', 'Rozebutt', 'Carbon', 'Bremsenspriets',
                       'Bremsenspriets', 'Carbon', 'Alu_7075', 'Ziptie' ],
    resource_zero : 2, //'Woestijn' shall be matched with value 0. It is located at position 2 in the above 2 arrays.
};

function array_contains(array, item) {
    for(var i = 0; i < array.length; i++){
        if(array[i] == item) {
            return true;
        }
    }
    return false;
}

/**
 * The board.
 * @constructor
 */
function board() {
    // Application Constructor
    var this_board = this;
    this.tiles = null;
    
    /*** get_random_idx
     * A quick way to get a random item from a array
     * 
     * @param inp_arr : array from which a random item is to be selected.
     * 
     * @return: a random item from inp_arr
     ***/
    this.get_random_item = function(inp_arr) {
        var idx = Math.floor(Math.random() * inp_arr.length);
        return inp_arr[idx];
    };
    
    /*** initialize_fixed
     * Initialize the board to the fixed layout as found in the Game Rules
     * www.catan.com/en/download/?SoC_rv_Rules_091907.pdf
     * 
     * @param seed : This argument can be supplied for compatibility with
     *               other initialize modes, but is completely ignored.
     * 
     ***/
    this.initialize_fixed = function(seed) {
        // Copy the resources from the config, just to be sure a different game-mode
        // does not edit our config.
        this_board.tiles = [];
        var tile_resources = board_config.fixed_resources.slice(0);
        var tile_values = board_config.fixed_values.slice(0);
    
        /* Create the board */
        for(var tile_idx=0; tile_idx < tile_values.length; tile_idx++) {
            var tile_value = tile_values[tile_idx];
            var tile_resource = tile_resources[tile_idx];
            this_board.tiles.push(new tile(tile_value, tile_resource));
        }
        
        if(!this_board._verify()) {
            window.alert('Big error in programming! Fixed board does not pass sanity check');
        }
    };
    
    /*** initialize_fixed
     * Initialize the board to a random layout for the tiles, but an
     * ordered layout for the numbers.
     * www.catan.com/en/download/?SoC_rv_Rules_091907.pdf
     * 
     * @param seed : Use this seed to initialize the PRNG, so that the
     *               same board can be generated again.
     * 
     ***/
    this.initialize_ordered = function(seed) {
        if(arguments.length < 1) {
            var now = new Date();
            var seed = now.valueOf();
        }
        Math.seedrandom(seed);
        
        this_board.tiles = [];
        // Start tile must be one of the corner tiles.
        var tile_now = this_board.get_random_item(board_config.start_positions);
        var tile_list = [];
        
        // Select a woestijnplace, since this tile does not get a number from the tile order list.
        var woestijnplace = Math.floor(Math.random() * board_config.nb_tiles);
        
        // Generate the tile order list which contains the ID's of the tiles in the order of which the numbers are to be placed
        for(var tilecnt = 1; tilecnt < board_config.nb_tiles; tilecnt++) {
            //Don't push if it is the woestijnplace.
            if(tile_now!=woestijnplace){
                tile_list.push(tile_now);
            }
            if(tile_list.indexOf(board_config.next_tiles[tile_now][0]) < 0) {
                tile_now = board_config.next_tiles[tile_now][0];
            }
            else {
                tile_now = board_config.next_tiles[tile_now][1];
            }
        }
        tile_list.push(tile_now);
        
        var tile_resources = board_config.fixed_resources.slice(0);
        var tile_values = board_config.fixed_values.slice(0); // Start with the ordered list of values.
        // Get the woestijn out of the resources before shuffling
        var woestijn = tile_resources[board_config.resource_zero];
        tile_resources = tile_resources.slice(0, board_config.resource_zero).concat(tile_resources.slice(board_config.resource_zero + 1));
        // Put the woestijn at the randomly generated woestijnplace
        tile_resources = tile_resources.slice(0, woestijnplace).concat([woestijn]).concat(tile_resources.slice(woestijnplace));
        
        // Loop through the tile order list and assign the numbers accordingly.
        for(var idx=0; idx < tile_list.length; idx++) {
            tile_values[tile_list[idx]] = board_config.number_order[idx];
        }
        tile_values[woestijnplace] = 0; // Woestijn is not in the tile order list.
        
        /* Create the board */
        for(var tile_idx=0; tile_idx < tile_values.length; tile_idx++) {
            var tile_value = tile_values[tile_idx];
            var tile_resource = tile_resources[tile_idx];
            this_board.tiles.push(new tile(tile_value, tile_resource));
        }
        
        if(!this_board._verify()) {
            window.alert('Big error in programming! Non-randomly generated board does not pass sanity check');
        }
    };
    
    /*** initialize_random
     * Initialize the board to a random layout, with the exception that
     * 6's and 8's are not allowed to be adjecent.
     * 
     * @param seed : Use this seed to initialize the PRNG, so that the
     *               same board can be generated again.
     *
     ***/
    this.initialize_random = function(seed) {
        if(arguments.length < 1) {
            var now = new Date();
            var seed = now.valueOf();
        }
        Math.seedrandom(seed);
        this_board.tiles = [];
        
        // Simply keep generating random boards until a valid one is found.
        while(!this_board._verify()){
            this_board.tiles = [];
            var tile_values = board_config.fixed_values.slice(0);
            var tile_resources = board_config.fixed_resources.slice(0);
            // Get the woestijn out of the resources before shuffling
            var woestijn = tile_resources[board_config.resource_zero];
            tile_resources = tile_resources.slice(0, board_config.resource_zero).concat(tile_resources.slice(board_config.resource_zero+1));
            this_board._shuffle_array(tile_values);
            this_board._shuffle_array(tile_resources);
            
            // Put the woestijn at the place of value 0.
            var woestijnplace = tile_values.indexOf(0);
            tile_resources = tile_resources.slice(0, woestijnplace).concat([woestijn].concat(tile_resources.slice(woestijnplace)));
            
            for(var tile_idx=0; tile_idx < tile_values.length; tile_idx++) {
                var tile_value = tile_values[tile_idx];
                var tile_resource = tile_resources[tile_idx];
                this_board.tiles.push(new tile(tile_value, tile_resource));
            }
        }
    };
    
    /*** _shuffle_array
     * Randomly shuffle an array in-place.
     * 
     * @param array : The array to be shuffled.
     * 
     ***/
    /* Kang from https://github.com/Daplie/knuth-shuffle */
    this._shuffle_array = function(array) {
        var currentIndex = array.length;
        var temporaryValue;
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
    };
    
    /*** _verify
     * Verify if the board complies to the rule that tiles can't be adjecent
     * Especially usefull when generating a random board.
     * 
     * @return:      true if the board meets the requirement, false otherwise;
     ***/
    this._verify = function() {
        if(this_board.tiles.length != board_config.nb_tiles)
            return false;
        
        for(var tile_id = 0; tile_id < this_board.tiles.length; tile_id++) {
            var tile = this_board.tiles[tile_id];
            if(array_contains(board_config.disallow_adjecent, tile.number)) {
                for(var tile_adjecent_id = 0; 
                        tile_adjecent_id < board_config.adjecent_tiles[tile_id].length; 
                        tile_adjecent_id++){
                    tile_adjecent = board_config.adjecent_tiles[tile_id][tile_adjecent_id];
                    if(array_contains(board_config.disallow_adjecent, this_board.tiles[tile_adjecent].number)){
                        return false;
                    }
                }
            }
        }
        return true;
    };
    
    /** Updates the LED state of all tiles.
     *      @param highlight_number:    If equal to our own number, highlight the tile.
     *      @param highlight_resource:  If equal to our own resource, highlight the tile.
     *      @param place:               If evaluates to true, highlight all tiles a little bit.
    **/
    this.update_state = function(highlight_number, highlight_resource, place){
        for(var tileidx = 0; tileidx<this_board.tiles.length; tileidx++){
            var tile = this_board.tiles[tileidx];
            tile.update_state(highlight_number, highlight_resource, place=false);
        }
    };
    
    /** Get the LED values from all tiles.
     * 
     * @return: array of integers that each represent a byte to be send to the LEDs
    **/
    this.get_leds = function() {
        var retval = [];
        for(var tile_id = 0; tile_id < this_board.tiles.length; tile_id++) {
            retval.concat(this_board.tiles[tile_id].get_leds());
        }
        return retval;
    };
}
