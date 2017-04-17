/*
 * game.js
 * 
 * This file contains the functions to play the catan game.
 */

playlist = [
'sounds/Billy_Mays.Billy_Mays_dick_on_this_thing.mp3',
'sounds/Billy_Mays.Billy_Mays_don_t_use_old_soap.mp3',
'sounds/Billy_Mays.Billy_Mays_here.mp3',
'sounds/Billy_Mays.Billy_mays_shit_in_the_bathtub.mp3',
'sounds/Billy_Mays.Billy_Mays_spaghetti_in_the_shower.mp3',
'sounds/Chewbacca.roar.mp3',
'sounds/Gunther_D.Gunther_D_-_BlijvenZitten.mp3',
'sounds/Gunther_D.Gunther_D_-_Den_Toeter.mp3',
'sounds/Gunther_D.Gunther_D_-_Een_gelukkige_verjaardag_ook_van.mp3',
'sounds/Gunther_D.Gunther_D_-_Jaaaa.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debiteuren_-_goeiesmorreges.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debiteuren_-_lachen.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debiteuren_stiften_1.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debiteuren_stiften_2.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debiteuren_stiften_3.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debiteuren_stiften_4.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debitoren_1.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debitoren_fraulein_birgit.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debitoren_gutemorgen_herren_vons_guten_leben.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debitoren_haltestelle.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debitoren_silverster_stallone.mp3',
'sounds/Jiskefet.Debiteuren_en_debitoren.debitoren_wassermelone.mp3',
'sounds/Jiskefet.Jiskefet-DuitserGroenteman.mp3',
'sounds/Jiskefet.Jiskefet-Wiedergutmachungschnitzel.mp3',
'sounds/Jiskefet.Multilul.multilul_fluiten.mp3',
'sounds/Jiskefet.Multilul.multilul_hey_ik_ben_je_naam_effe_kwijt.mp3',
'sounds/Jiskefet.Multilul.multilul_hibbem.mp3',
'sounds/Jiskefet.Multilul.multilul_mosterd.mp3',
'sounds/Jiskefet.Multilul.multilul_nieuw_systeempje.mp3',
'sounds/Jiskefet.Muskietenpak.mp3',
'sounds/Jiskefet.raarrr_mp3.mp3',
'sounds/Jiskefet.Schnautzi_der_Wunderhund.mp3',
'sounds/Jiskefet.Tampert.da_druben.mp3',
'sounds/Jiskefet.Tampert.das_haben_sie_gut_hehort.mp3',
'sounds/Jiskefet.Tampert.das_war_eind_wind.mp3',
'sounds/Jiskefet.Tampert.der_mensch_kommt_allein.mp3',
'sounds/Jiskefet.Tampert.die_zeit_fliegt.mp3',
'sounds/Jiskefet.Tampert.freddie_komm_sofort.mp3',
'sounds/Jiskefet.Tampert.halbes_wort.mp3',
'sounds/Jiskefet.Tampert.herr_lapinski.mp3',
'sounds/Jiskefet.Tampert.ins_zimmer_hinein.mp3',
'sounds/Jiskefet.Tampert.jaja_bin_ich.mp3',
'sounds/Jiskefet.Tampert.kein_pummel.mp3',
'sounds/Jiskefet.Tampert.koko_drummel.mp3',
'sounds/Jiskefet.Tampert.Tampert-ich_bin_sofort_gekommen.mp3',
'sounds/Jiskefet.Tampert.tampert_kriminalpolizei.mp3',
'sounds/Jiskefet.Tampert.tropical_drink.mp3',
'sounds/Jiskefet.Tampert.vielleicht_ist_der_mensch.mp3',
'sounds/Jiskefet.Tampert.was_haltest_du_davon_freddie.mp3',
'sounds/Jiskefet.Tampert.wie_sage_ich_das_jetzt.mp3',
'sounds/King_Julien.I_am_a_lady_julian.mp3',
'sounds/King_Julien.iamveryclever.mp3',
'sounds/King_Julien.partinggiftcrowngecko.mp3',
'sounds/King_Julien.professional_whistler.mp3',
'sounds/King_Julien.what_is_it_julian.mp3',
'sounds/Little_Britain.britain-britainbritainbritain.mp3',
'sounds/Little_Britain.britain-flute.mp3',
'sounds/Little_Britain.Call_me_Bubbles.mp3',
'sounds/Little_Britain.computer_says_no.mp3',
'sounds/Little_Britain.dust_anybody_no.mp3',
'sounds/Little_Britain.eh_eh_eeeeh.mp3',
'sounds/Little_Britain.i_want_bitty.mp3',
'sounds/Little_Britain.no_but_yeah_but_no.mp3',
'sounds/Little_Britain.the_only_gay_in_the_village.mp3',
'sounds/Little_Britain.yeah_I_know_.mp3',
'sounds/Monty_Python.completely_different2.mp3',
'sounds/Monty_Python.ecky_ecky_x.mp3',
'sounds/Monty_Python.flesh_wound.mp3',
'sounds/Monty_Python.Monty-Pythons-Flying-Circus-Theme.mp3',
'sounds/Monty_Python.much_rejoicing.mp3',
'sounds/Monty_Python.nih.mp3',
'sounds/Monty_Python.nudge_nudge2.mp3',
'sounds/Monty_Python.spam2_x.mp3',
'sounds/Monty_Python.spam3.mp3',
'sounds/Monty_Python.spam-x3.mp3',
'sounds/Monty_Python.spanish_inquisition.mp3',
'sounds/Radio_Bergeijk.Anky_lingerie_reclame.mp3',
'sounds/Radio_Bergeijk.boomhoroscoop.mp3',
'sounds/Radio_Bergeijk.Brekend_nieuws.mp3',
'sounds/Radio_Bergeijk.Bruno_Goring.mp3',
'sounds/Radio_Bergeijk.Decembermaand_sexmaand.mp3',
'sounds/Radio_Bergeijk.Gezondheidsnieuws.mp3',
'sounds/Radio_Bergeijk.Graag_gedaan_1.mp3',
'sounds/Radio_Bergeijk.Graag_gedaan_2.mp3',
'sounds/Radio_Bergeijk.Graag_gedaan_3.mp3',
'sounds/Radio_Bergeijk.Graag_gedaan_4.mp3',
'sounds/Radio_Bergeijk.Graag_gedaan_5.mp3',
'sounds/Radio_Bergeijk.Gratis_op_of_af_te_halen.mp3',
'sounds/Radio_Bergeijk.Heivereniging.mp3',
'sounds/Radio_Bergeijk.Helicopter.mp3',
'sounds/Radio_Bergeijk.Hoog_bezoek.mp3',
'sounds/Radio_Bergeijk.Klussenmetpeer.mp3',
'sounds/Radio_Bergeijk.kopstootraki.mp3',
'sounds/Radio_Bergeijk.Los_de_napalm.mp3',
'sounds/Radio_Bergeijk.Meteoriet.mp3',
'sounds/Radio_Bergeijk.Negerrubriek_de_tamtam.mp3',
'sounds/Radio_Bergeijk.Oproepertjes.mp3',
'sounds/Radio_Bergeijk.Radio_Bergeijk_musical.mp3',
'sounds/Radio_Bergeijk.Radioreportage_2.mp3',
'sounds/Radio_Bergeijk.Radioreportage.mp3',
'sounds/Radio_Bergeijk.RB_intro.mp3',
'sounds/Radio_Bergeijk.RB_tune_1.mp3',
'sounds/Radio_Bergeijk.RB_tune_2.mp3',
'sounds/Radio_Bergeijk.RB_tune_3.mp3',
'sounds/Radio_Bergeijk.Snotterig.mp3',
'sounds/Radio_Bergeijk.Sportnieuws.mp3',
'sounds/Radio_Bergeijk.Tafelgesprek.mp3',
'sounds/Radio_Bergeijk.TFC.mp3',
'sounds/Radio_Bergeijk.Vacature_cnc_draaier.mp3',
'sounds/Radio_Bergeijk.Verschrikkelijk.mp3',
'sounds/Radio_Bergeijk.Zomerspeciaal.mp3',
'sounds/Rembo_en_Rembo.RemboRemboAlleennogonderbroek.mp3',
'sounds/Rembo_en_Rembo.RemboRemboAutowassen.mp3',
'sounds/Rembo_en_Rembo.RemboRemboDastochnienormaal.mp3',
'sounds/Rembo_en_Rembo.RemboRemboHadjetniegezegddan.mp3',
'sounds/Rembo_en_Rembo.RemboRemboHenkNozemans.mp3',
'sounds/Rembo_en_Rembo.RemboRemboHetisjeVrouw.mp3',
'sounds/Rembo_en_Rembo.RemboRemboKanechniedoordebeugel.mp3',
'sounds/Rembo_en_Rembo.RemboRemboNiettegeleuve.mp3',
'sounds/Rembo_en_Rembo.RemboRemboNognpotteke.mp3',
'sounds/Rembo_en_Rembo.RemboRemboStrippokeravond.mp3',
'sounds/Rembo_en_Rembo.RemboRemboTingTingTing.mp3',
'sounds/Rembo_en_Rembo.RemboRemboTjeminee.mp3',
'sounds/Rembo_en_Rembo.RemboRemboTrekuit.mp3',
'sounds/Rembo_en_Rembo.RemboRemboZietergezonduit.mp3'
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
            console.log('MD5 based random number: ' + rand_number);
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
                this_game.gui.ask_startroll();
            }
            else {
                this_game.turn = this_game._get_first_turn();
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
    };
    
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
        var update = [];
        var keep = [];
        /* First, split the tiles in two groups: Those who have changed and those that didn't change.
         * First update the changed tiles, but also update the tiles that didn't change just in case */
        
        for(var tileidx = 0; tileidx < 19; tileidx++) {
            if(this_game.board.tiles[tileidx].update) {
                update.push(tileidx);
            }
            else {
                keep.push(tileidx);
            }
        }
        for(var idx = 0; idx < update.length; idx++) {
            var tileidx = update[idx];
            var data = this_game.board.tiles[tileidx].get_leds(tileidx, idx == update.length-1);
            this_game.send_data(data);
        }
        for(var idx = 0; idx < keep.length; idx++) {
            var tileidx = keep[idx];
            var data = this_game.board.tiles[tileidx].get_leds(tileidx, idx == keep.length-1);
            this_game.send_data(data);
        }
        
    };
}
