/*
 * board.js
 * 
 * This file contains the "Object" that represents the entire Catan board.
 */

var SEG_OFF = [0, 0, 0];
var SEG_ON  = [255, 0, 0];

var tile_config = {
    Number_leds : {
    0  : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    2  : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    3  : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    4  : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    5  : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    6  : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    8  : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_ON , SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    9  : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    10 : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    11 : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    12 : [].concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_ON , SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    },
    Resource_colors : [
        ['Woestijn'          , [160,  80,   0]],  // Oranje
        ['Bremsenspriets'    , [128, 128,   0]],  // Geel
        ['Carbon'            , [255,   0,   0]],  // Rood
        ['Rozebutt'          , [120,  60,  60]],  // Roze
        ['Alu_7075'          , [  0,   0, 255]],  // Wit
        ['Ziptie'            , [  0, 255,   0]],  // Groen
    ],
    Resource_tiles : [true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    
    dimmed_intensity : 0.1,
    highlighted_intensity : 1.0,
    place_intensity : 0.3
};

/* Construct the resource_leds object */
var Resource_leds = {};
for(var idx = 0; idx < tile_config.Resource_colors.length; idx++) {
    resource = tile_config.Resource_colors[idx][0];
    color    = tile_config.Resource_colors[idx][1];
    var leds = [];
    for(var lednr = 0; lednr < tile_config.Resource_tiles; lednr++){
        if(tile_config.Resource_tiles[lednr])
            leds.concat(color);
        else
            leds.concat([0, 0, 0]);
        }
    Resource_leds[resource] = leds;
}
 
function tile(number, resource) {
    this.number = number;
    this.resource = resource;
    this.place = false;
    this.highlight = false;
    
    this.led_state = 0;
    
    var this_tile = this;
    /*** update_state:
     * Calculate which LEDs to turn on based on wheter we are highlighed or not
     * In the default situation, the LED-template is multiplied by dimmed_intensity.
     * If we are highlighted or the board is placed, a different intensity is used.
     * 
     * @param highlight_number:     If equal to this.number, use highlighted intensity.
     * @param highlight_resource:   If equal to this.resource, use highlighted intensity.
     * @param place:                If true, use place intensity.
     ***/
    this.update_state = function(highlight_number, highlight_resource, place) {
        this_tile.led_state = tile_config.Number_leds[this_tile.number].slice(0);
        var resource_leds = Resource_leds[this_tile.resource];
        
        var resource_intensity = tile_config.dimmed_intensity;
        this_tile.highlight = false;
        this_tile.place = false;
        
        if(this_tile.number == highlight_number || this_tile.resource == highlight_resource){
            resource_intensity = tile_config.highlighted_intensity;
            this_tile.highlight = true;
        }
        
        if(place) {
            resource_intensity = tile_config.place_intensity;
            this_tile.place = true
        }
        
        for(var led_idx = 0; led_idx < this_tile.led_state.length; led_idx++)
            this_tile.led_state[led_idx] += parseInt(resource_intensity * resource_leds[led_idx]);
    };
    
    this.get_leds = function() {
        return this_tile.led_state.slice(0);
    };
    /* On init, run the update function */
    this.update_state(-1, -1, true);
}
