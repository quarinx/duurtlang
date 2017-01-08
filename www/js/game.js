/*
 * game.js
 * 
 * This file contains the functions to play the catan game.
 */

playlist = [
"sounds/Brekend_nieuws.mp3",
"sounds/debiteuren_lachen.mp3",
"sounds/debiteuren_stiften_4.mp3",
"sounds/ins_zimmer_hinein.mp3",
"sounds/raarrr.mp3",
"sounds/RemboRemboStrippokeravond.mp3",
"sounds/tampert_kriminalpolizei.mp3",
]

var STATE_UNINITIALIZED = 0;
var STATE_PLAYING = 2;

function catan_game(dice_roll, dice_set, msg_write, log, update_graph, play_sound) {
    console.log("Creating catan game!");
    /* Save the callback functions. */
    this.dice_roll = dice_roll;
    this.dice_set = dice_set;
    this.msg_write = msg_write;
    this.log = function(msg) { log(msg); console.log(msg) };
    this.update_graph = update_graph;
    this.play_sound = play_sound;
    
    
    // Application Constructor
    this.reset = function () {
        this.state = STATE_UNINITIALIZED;
        //this.players = []; /* Not yet supported */ 
        this.overall_stats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.hash_rnd = true;
        this.board = false;
    }
    this.reset();
    
    /** get_random_int
     * Get a random integer between low and high, each integer having (approximately) the same probability
     * The approximation comes from the fact that we reduce the hash to 32-bit, which is not always a multiple
     * of the possible numbers. However, for sane values of low and high the difference is significantly
     * less than anything Thijs should worry about.
     * When we don't hash the time, there is no upper bound so each number is exactly equally likely.
     * 
     * @param low           : Lowest possible number that can be returned (low itself is included)
     * @param high          : Highest possible number that can be returned (high itself is *not* included)
     * @param rand_number   : Optional integer that is used to generate the number i.s.o. the current time.
     **/
    this.get_random_int = function(low, high, rand_number) {
        /* If we don't get a random_number as input, use the current time. */
        if(arguments.length < 3) {
            var now = new Date();
            rand_number = now.valueOf();
        }
        modulo = high - low
        if(this.hash_rnd) {
            rand_number = crc32(rand_number);
        }
        return (rand_number % modulo) + low;
    }
    
    /** button_down
     * Function shall be executed when the red button is pressed.
     * 
     * Whenever the game is active, play animation and sound.
     * Any real function is executed once the button is released.
     * 
     * @param seed: Seed value for random MP3.
     *  */
    this.button_down = function(seed) {
        if(this.state == STATE_PLAYING) {
            if(arguments.length > 0)
                mp3idx = this.get_random_int(0, playlist.length, seed);
            else
                mp3idx = this.get_random_int(0, playlist.length);
            this.play_sound(playlist[mp3idx]);
            this.dice_roll();
            this.msg_write("Rolling the dice!");
            this.log("Playing sound-effect. Seed: " + seed + ", MP3 id=" + mp3idx +", MP3 filename=" + playlist[mp3idx]);
        }
    }
    
    
    /** button_up
     * Function shall be executed when the red button is pressed.
     * 
     * Whenever the game is active, play animation and sound.
     * Any real function is executed once the button is released.
     * 
     * @param seed: Seed value for dice roll.
     *  */
    this.button_up = function(seed) {
        if(this.state == STATE_UNINITIALIZED) {
            this.board = new board();
            this.board.initialize_random();
            this.msg_write("Generated board. Place tiles according to the colors of the LEDs.");
            this.update_btle();
            // Still placing tiles, but next time the button is pressed we just want to play!
            this.state = STATE_PLAYING;
            this.log("Generated board. Seed: " + seed);
        }
        else if(this.state == STATE_PLAYING){
            // Use only one shot of randomness, since otherwise the two will be related.
            if(arguments.length > 0)
                var dices = this.get_random_int(0, 36, seed);
            else
                var dices = this.get_random_int(0, 36);
            dice1 = parseInt(dices % 6);
            dice2 = parseInt(dices / 6);
            
            this.dice_set(dice1+1, dice2+1);
            msg = "Button released! Dice faces: " + (dice1+1) + ", " + (dice2+1);
            this.log(msg)
            
            dice_sum = dice1 + dice2;
            this.overall_stats[dice_sum] += 1;
            graphdata = {}
            for(var dice=0; dice<this.overall_stats.length; dice++){
                count = this.overall_stats[dice];
                graphdata[dice+2] = count
            }
            this.update_graph(graphdata);
            //Highlight selected tiles.
            this.board.update_state(dice1 + dice2 + 2, false);
            this.update_btle();
            this.log("Rolled the dice. Seed: " + seed + ", Random number=" + dices +", dice faces=" + (dice1+1) + "," + (dice2+1));
        }
    }
    
    /** update_btle
     * 
     *  Send the current state of the board via BTLE to the board itself
     **/
    this.update_btle = function() {
        //Not implemented.
    };
};
