/*
 * board.js
 * 
 * This file contains the "Object" that represents the entire Catan board.
 */

var SEG_OFF = [0, 0, 0];
var SEG_ON  = [255, 0, 0];

var tile_config = {
    Resource_colors : {
        'Woestijn'          : [160,  80,   0],  // Oranje
        'Bremsenspriets'    : [128, 128,   0],  // Geel
        'Carbon'            : [255,   0,   0],  // Rood
        'Rozebutt'          : [120,  60,  60],  // Roze
        'Alu_7075'          : [ 90,  90,  90],  // Wit
        'Ziptie'            : [  0, 255,   0],  // Groen
    },
    Sea_color : [0, 0, 255],
    Sea_intensity : 1.0,
    dimmed_intensity : 0.1,
    highlighted_intensity : 1.0,
    place_intensity : 0.3
};

var BLE_TILE = 0;
var BLE_NUMBER = 1;
var BLE_NUM_INT = 2;
var BLE_NUM_R = 3;
var BLE_NUM_G = 4;
var BLE_NUM_B = 5;
var BLE_RES_INT = 6;
var BLE_RES_R = 7;
var BLE_RES_G = 8;
var BLE_RES_B = 9;
var BLE_SEA_INT = 10;
var BLE_SEA_R = 11;
var BLE_SEA_G = 12;
var BLE_SEA_B = 13;
var BLE_UPDATE = 14;

var BLE_LENGTH = 15;


function tile(number, resource) {
    this.number = number;
    this.resource = resource;
    this.intensity = -1;
    this.place = false;
    this.highlight = false;
    this.update = true;
    
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
        var resource_intensity = tile_config.dimmed_intensity;
        this_tile.highlight = false;
        this_tile.place = false;
        
        if(this_tile.number == highlight_number || this_tile.resource == highlight_resource){
            resource_intensity = tile_config.highlighted_intensity;
            this_tile.highlight = true;
        }
        
        if(place) {
            resource_intensity = tile_config.place_intensity;
            this_tile.place = true;
        }
        
        if(this_tile.intensity != resource_intensity)
        {
            this_tile.update = true;
        }
        this_tile.intensity = resource_intensity;
    };
    
    /*** get_leds:
     * Get the bytes to send as a BLE packet to update the LED status of this tile.
     * Caller shall provide tile_idx since it is unknown to this object.
     * 
     * @param tile_idx:     Acutal location of tile on the board.
     * 
     * @return Uint8Array of data.
     ***/
    this.get_leds = function(tile_idx, last) {
        var color = tile_config.Resource_colors[this_tile.resource];
        var data = new Uint8Array(BLE_LENGTH);
        data[BLE_TILE] = tile_idx;
        data[BLE_NUMBER] = this_tile.number;
        data[BLE_NUM_INT] = parseInt(255 * this_tile.intensity);
        data[BLE_NUM_R] = color[0];
        data[BLE_NUM_G] = color[1];
        data[BLE_NUM_B] = color[2];
        data[BLE_RES_INT] = parseInt(255 * this_tile.intensity);
        data[BLE_RES_R] = color[0];
        data[BLE_RES_G] = color[1];
        data[BLE_RES_B] = color[2];
        data[BLE_SEA_INT] = 0xFF; // sea bright
        data[BLE_SEA_R] = tile_config.Sea_color[0];
        data[BLE_SEA_G] = tile_config.Sea_color[1];
        data[BLE_SEA_B] = tile_config.Sea_color[2];
        if(last) {
            data[BLE_UPDATE] = 1;
        }
        else {
            data[BLE_UPDATE] = 0;
        }
        this_tile.update = false;
        
        return data;
    };
    /* On init, run the update function */
    this.update_state(-1, -1, true);
}
