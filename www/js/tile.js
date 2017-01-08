/*
 * board.js
 * 
 * This file contains the "Object" that represents the entire Catan board.
 */

var SEG_OFF = [0, 0, 0];
var SEG_ON  = [255, 0, 0];

var tile_config = {
    Number_leds : {
    0  : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    2  : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    3  : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    4  : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    5  : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    6  : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    8  : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_ON , SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    9  : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    10 : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    11 : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    12 : Array.concat(SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_ON , SEG_ON , SEG_OFF, SEG_ON , SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF, SEG_OFF), 
    },
    Resource_colors : [
        ["Woestijn"          , [160,  80,   0]],  // Oranje
        ["Bremsenspriets"    , [128, 128,   0]],  // Geel
        ["Carbon"            , [255,   0,   0]],  // Rood
        ["Rozebutt"          , [120,  60,  60]],  // Roze
        ["Alu_7075"          , [  0,   0, 255]],  // Wit
        ["Ziptie"            , [  0, 255,   0]],  // Groen
    ],
    Resource_tiles : [true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
}


var Resource_leds = {}
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
        this.led_state = tile_config.Number_leds[this.number].slice(0);
        resource_leds = Resource_leds[this.resource];
        
        resource_intensity = tile_config.dimmed_intensity;
        this.highlight = false;
        this.place = false;
        
        if(this.number == highlight_number || this.resource == highlight_resource){
            resource_intensity = tile_config.highlighted_intensity;
            this.highlight = true;
        }
        
        if(place) {
            resource_intensity = tile_config.place_intensity;
            this.place = true
        }
        
        for(var led_idx = 0; led_idx < this.led_state.length; led_idx++)
            this.led_state[led_idx] += parseInt(resource_intensity * resource_leds[led_idx]);
    }
    
    this.get_leds = function() {
        var retval = []
        for(var led_idx = 0; led_idx < this.led_state.length; led_idx++)
            retval.push(this.led_state[led_idx])
    }
    /* On init, run the update function */
    this.update_state(-1, -1, true);
};
