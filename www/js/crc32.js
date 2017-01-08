/*
 * crc32.js
 * 
 * Kang from http://stackoverflow.com/questions/18638900/javascript-crc32
 * Modified to accept little-endian integer iso byte string.
 */
var makeCRCTable = function(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

/* crc32 of a little-endian integer */
var crc32 = function(inp) {
    var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
    var crc = 0 ^ (-1);

    while(inp > 0) {
        var byte = inp & 0xFF;
        inp = inp >> 8;
        crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
};
