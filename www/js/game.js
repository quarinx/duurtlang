/*
 * game.js
 * 
 * This file contains the functions to play the catan game.
 */

playlist = [
'sounds/Brekend_nieuws.mp3',
'sounds/debiteuren_lachen.mp3',
'sounds/debiteuren_stiften_4.mp3',
'sounds/ins_zimmer_hinein.mp3',
'sounds/raarrr.mp3',
'sounds/RemboRemboStrippokeravond.mp3',
'sounds/tampert_kriminalpolizei.mp3',
];

var STATE_UNINITIALIZED = 0;
var STATE_ROLLFORSTART = 1;
var STATE_PLAYING = 2;

function catan_game(gui, send_data) {
    console.log('Creating catan game!');
    /* Save the callback functions. */
    this.dice_roll = gui.dice_roll;
    this.dice_set = gui.dice_set;
    this.msg_write = gui.msg_write;
    this.log = function(msg) { gui.log_line(msg); console.log(msg) };
    this.gui = gui;
    this.update_graph = gui.update_chart;
    this.play_sound = gui.play_sound;
    this.send_data = send_data;
    var this_game = this;
    
    
    // Application Constructor
    this.reset = function () {
        this_game.state = STATE_UNINITIALIZED;
        //this_game.players = []; /* Not yet supported */ 
        this_game.player_stats = [];
        this_game.startrolls = [];
        this_game.hash_rnd = true;
        this_game.players = [];
        this_game.board = new board();
        this_game.turn = 0;
    };
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
     * 
     * @return : The random integer.
     **/
    this.get_random_int = function(low, high, rand_number) {
        /* If we don't get a random_number as input, use the current time. */
        if(arguments.length < 3) {
            var now = new Date();
            rand_number = now.valueOf();
        }
        modulo = high - low;
        if(this_game.hash_rnd) {
            /* Strictly speaking, this is not fair. Lower numbers have a higher probability than
             * numbers above max-(max % modulo), but the probability of even once reaching this 
             * condition during the lifetime of the game is less than 0.01% for a 32-bit value */
            var hashed = md5('' + rand_number);
            rand_number = parseInt(hashed.slice(0,7), 16);
            console.log("MD5 based random number: " + rand_number);
            /* By the way, using the unhashed time is fair since there is no upper bound. */
        }
        return (rand_number % modulo) + low;
    };
    
    /** button_down
     * Function shall be executed when the red button is pressed.
     * 
     * Whenever the game is active, play animation and sound.
     * Any real function is executed once the button is released.
     * 
     * @param seed: Seed value for random MP3.
     *  */
    this.button_down = function(seed) {
        if(arguments.length > 0)
            mp3idx = this_game.get_random_int(0, playlist.length, seed);
        else
            mp3idx = this_game.get_random_int(0, playlist.length);
        this_game.play_sound(playlist[mp3idx]);
        
        if(this_game.state == STATE_PLAYING || this_game.state == STATE_ROLLFORSTART) {
            this_game.dice_roll();
            this_game.msg_write('Rolling the dice!');
            this_game.log('Playing sound-effect. Seed: ' + seed + ', MP3 id=' + mp3idx +', MP3 filename=' + playlist[mp3idx]);
        }
    };
    
    
    /** button_up
     * Function shall be executed when the red button is pressed.
     * 
     * Whenever the game is active, play animation and sound.
     * Any real function is executed once the button is released.
     * 
     * @param seed: Seed value for dice roll.
     *  */
    this.button_up = function(seed) {
        if(this_game.state == STATE_UNINITIALIZED) {
            this_game.new_game('fixed', ['All players']);
        }
        else if(this_game.state == STATE_ROLLFORSTART) {
            // Use only one shot of randomness, since otherwise the two will be related.
            if(arguments.length > 0)
                var dices = this_game.get_random_int(0, 36, seed);
            else
                var dices = this_game.get_random_int(0, 36);
            var dice1 = parseInt(dices % 6);
            var dice2 = parseInt(dices / 6);
            
            this_game.dice_set(dice1+1, dice2+1);
            this_game.startrolls[this_game.turn] = dice1 + dice2 + 2;
            msg = 'Button released! Dice faces: ' + (dice1+1) + ', ' + (dice2+1);
            this_game.log(msg);
            
            if(this_game.turn < (this_game.players.length - 1)){
                this_game.turn++;
                this_game.gui.ask_startroll()
            }
            else {
                this_game.turn = this_game._get_first_turn()
                if(this_game.turn < 0) {
                    this_game.turn = 0;
                }
                else {
                    this_game.gui.ask_start();
                    this_game.state = STATE_PLAYING;
                }
            }
        }
        else if(this_game.state == STATE_PLAYING){
            // Use only one shot of randomness, since otherwise the two will be related.
            if(arguments.length > 0)
                var dices = this_game.get_random_int(0, 36, seed);
            else
                var dices = this_game.get_random_int(0, 36);
            var dice1 = parseInt(dices % 6);
            var dice2 = parseInt(dices / 6);
            
            this_game.dice_set(dice1+1, dice2+1);
            msg = 'Button released! Dice faces: ' + (dice1+1) + ', ' + (dice2+1);
            this_game.log(msg);
            
            var dice_sum = dice1 + dice2;
            this_game.player_stats[this_game.turn][dice_sum] += 1;
            graphdata = [];
            for(var i = 0; i<this_game.players.length; i++) {
                graphdata.push({name: this_game.players[i], data: this_game.player_stats[i]});
            }
            //Highlight selected tiles.
            this_game.board.update_state(dice1 + dice2 + 2, false);
            this_game.update_btle();
            this_game.log(this_game.get_player() + ' rolled the dice. Seed: ' + seed + ', Random number=' + dices +', dice faces=' + (dice1+1) + ',' + (dice2+1));
            this_game._next_turn();
            this_game.update_graph(graphdata);
        }
    };
    
    this._next_turn = function() {
        this_game.turn++;
        this_game.turn %= this_game.players.length;
    };
    
    this._get_first_turn = function () {
        var player;
        var maxroll = -1;
        var maxcount = 0;
        var winner;
        
        for(player = 0; player < this_game.startrolls.length; player++) {
            if(this_game.startrolls[player] == maxroll) {
                maxcount++;
            }
            else if(this_game.startrolls[player] > maxroll) {
                maxcount = 1;
                maxroll = this_game.startrolls[player];
                winner = player;
            }
        }
        if(maxcount != 1) {
            return -1;
        }
        return winner;
    }
    
    this.get_player = function() {
        return this_game.players[this_game.turn];
    };
    
    this.new_game = function(board_type, players, seed) {
        var seed_str;
        if(typeof seed === 'undefined' || seed === '') {
            var now = new Date();
            seed_str = '' + now.valueOf();
        }
        else {
            seed_str = '' + seed;
        }
        
        this_game.log('Generating ' + board_type + ' board. Seed: ' + seed_str);
        this_game.players = players;        
        var hashed = md5(seed_str);
        var seed_int = parseInt(hashed.slice(0,7), 16);
        
        switch (board_type)
        {
          default       : throw new Error('Unsupported board type');    break;
          case 'fixed'  : this_game.board.initialize_fixed(seed_int);   break;
          case 'ordered': this_game.board.initialize_ordered(seed_int); break;
          case 'random' : this_game.board.initialize_random(seed_int);  break;
        }
        
        this_game.player_stats = [];
        for(var i = 0; i < this_game.players.length; i++) {
            this_game.player_stats[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        this_game.startrolls = [];
        
        this_game.gui.msg_write('Generated board. Place tiles according to the colors of the LEDs.');
        this_game.update_btle();
        // Still placing tiles, but next time the button is pressed we just want to play!
        this_game.state = STATE_ROLLFORSTART;
        this_game.turn = 0;
        graphdata = [];
        for(var i = 0; i<this_game.players.length; i++) {
            graphdata.push({name: this_game.players[i], data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]});
        }
        this_game.update_graph(graphdata);
        this_game.gui.ask_startroll();
    };
    /** update_btle
     * 
     *  Send the current state of the board via BTLE to the board itself
     **/
    this.update_btle = function() {
        
        for(var tileidx = 0; tileidx < 19; tileidx++) {
            var data = new Uint8Array(14);
            data[0] = tileidx;
            data[1] = this_game.board.tiles[tileidx].number;
            data[3] = 0xFF;
            data[4] = 0xFF;
            data[5] = 0x00;
            data[6] = 0x00;
            data[7] = 0xFF;
            data[8] = this_game.tiles[tileidx].led_state[0];
            data[9] = this_game.tiles[tileidx].led_state[1];
            data[10] = this_game.tiles[tileidx].led_state[2];
            data[11] = 0xFF;
            data[12] = 0x00;
            data[13] = 0x00;
            data[14] = 0xFF;
            
            
            this_game.send_data(data);
        };
    };
}
