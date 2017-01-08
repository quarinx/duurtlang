/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var tile_locations = [
"174.205,   1.0", // 0
" 86.603, 151.0", // 1
"  1.000, 301.0", // 2
" 86.603, 451.0", // 3
"174.205, 601.0", // 4
"347.410, 601.0", // 5
"520.615, 601.0", // 6
"606.218, 451.0", // 7
"693.820, 301.0", // 8
"606.218, 151.0", // 9
"520.615,   1.0", // 10
"347.410,   1.0", // 11
"259.808, 151.0", // 12
"174.205, 301.0", // 13
"259.808, 451.0", // 14
"433.013, 451.0", // 15
"520.615, 301.0", // 16
"433.013, 151.0", // 17
"347.410, 301.0", // 18
]

var tile_colors = {
    "Woestijn"          : [220, 110,   0],  // Oranje
    "Bremsenspriets"    : [180, 180,   0],  // Geel
    "Carbon"            : [255,   0,   0],  // Rood
    "Rozebutt"          : [180, 100, 100],  // Roze
    "Alu_7075"          : [  0,   0, 255],  // Blauw
    "Ziptie"            : [  0, 255,   0],  // Groen
};

function get_svg(board) {
    var svgdata = '<svg\n   xmlns="http://www.w3.org/2000/svg"\n   width="868.025"\n   height="802.0"\n   id="svg4171"\n   version="1.1">\n  <g id="board" transform="scale(0.25)">';
    
    for(var tileid = 0; tileid < board.tiles.length; tileid++) {
        var tile = board.tiles[tileid];
        svgdata += '    <g\n       id="tile' + tileid + '"\n       transform="translate(';
        svgdata += tile_locations[tileid];
        svgdata += ')">\n';
        
        var intensity = 0.2;
        if(tile.highlight || tile.place) {
            intensity = 1.0;
        }
        
        fill = '#';
        for(color = 0; color < 3; color++){
            var intval = parseInt(intensity * tile_colors[tile.resource][color]);
            var strval = intval.toString(16);
            if(strval.length == 1){
                strval = "0" + strval;
            }
            fill += strval;
        }
        
        svgdata += '      <path\n         id="hexagon' + tileid + '"\n         style="fill:' + fill + ';stroke:#000000;stroke-width:2.0;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none"\n         d="M 0.0,50.0 0.0,150.0 86.603,200.0 173.205,150.0 173.205,50.0 86.603,0.0 0.0,50.0" />\n';
        svgdata += '      <text\n         id="number ' + tileid + '"\n         xml:space="preserve"\n         style="font-style:normal;font-weight:normal;font-size:40px;line-height:125%;font-family:Sans;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"\n         x="65.0"\n         y="110.0">\n';
        if(tile.number != 0) svgdata += tile.number;
        svgdata += '      </text>\n';
        svgdata += '    </g>\n';
        
    }
    svgdata += '\n  </g>\n</svg>';
    return svgdata;
}
