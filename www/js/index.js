// (c) 2015 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global ble, game, gui */
/* jshint browser: true , devel: true*/

// See BLE heart rate service http://goo.gl/wKH3X7


var app = {
    led: {
        service: 'A000',
        tile: 'A001',
        brightness: 'A002',
        power: 'A003',
        battery : 'A004'
    },
    button: {
        service: 'B000',
        power: 'B001',
        event : 'B002'
    },
    dice: {
        service: 'C000',
        power: 'C001',
        event : 'C002',
        status : 'C002' // Not used.
    },
    initialize: function() {
        this.peripheral_id = 0;
        this.button_id = 0;
        this.bindEvents();
        this.onConnectCallback = null;
        gui.initialize();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.scanning = false;
        app.scan();
    },
    registerUpdate: function(callback) {
        app.onConnectCallback = callback;
    },
    registerButtonDown: function(callback) {
        app.onButtonDown = callback;
    },
    registerButtonUp: function(callback) {
        app.onButtonUp = callback;
    },
    scan: function() {
        function onScan(peripheral) {
            // this is demo code, assume there is only one heart rate monitor
            app.logStatus('Found ' + peripheral.id);
            ble.connect(peripheral.id, app.onConnect, app.onDisconnect);
        }
        
        // If we are still scanning, try stop scanning and restart.
        // If stopping failes, try stopping again.
        if(app.scanning) {
            ble.stopScan(app.scanStop, app.scan);
        }
        else {
            app.logStatus('Scanning for LED Service...');
            // First set scanning to True, so that a timer can't
            // re-start scanning.
            app.scanning = true;
            ble.startScan([app.led.service, 
                           app.button.service, 
                           app.dice.service],
                           onScan, null);
        }
    },
    scanStop: function() {
        app.scanning = false;
        app.scan();
    },
    
    logStatus: function(str) {
        gui.log_line(str);
    },
    onSuccess: function() {
        null;
    },
    onFailure: function(reason) {
        app.logStatus('fail ' + reason);
    },
    onConnect: function(peripheral) {
        app.logStatus('Connected to ' + peripheral.id);
        
        // Assuming that BLE Cental always returns lower case
        if(peripheral.services.includes(app.led.service.toLowerCase())) {
            app.peripheral_id = peripheral.id;
            window.setTimeout(app.onConnectCallback, 10);
        } 
        else if(peripheral.services.includes(app.button.service.toLowerCase())) {
            app.button_id = peripheral.id;
            ble.startNotification(peripheral.id, 
                                  button.service,
                                  button.event,
                                  app.receiveButtonChange, 
                                  function () {
                                      app.logStatus('Error from button');
                                    });
        }
        else if(peripheral.services.includes(app.dice.service.toLowerCase())) {
            app.logStatus('Sorry, no dice support yet');
        }
        else {
            app.logStatus('Unknown service: ' + peripheral.services);
        }
        
        if(app.peripheral_id != 0 && app.button_id != 0) {
            ble.stopScan(function() {app.scanning = false});
        }

    },
    onDisconnect: function(peripheral) {
        if(peripheral.id == app.peripheral_id) {
            app.peripheral_id = 0;
            app.logStatus('Disconnected from board' + reason);
            // Restart scanning
            app.scan();
        } 
        else if(peripheral.id == app.button_id) {
            app.button_id = 0;
            app.logStatus('Disconnected from button' + reason);
            // Restart scanning
            app.scan();
        }
    },
    
    sendData: function (data) {
        if(app.peripheral_id != 0)
        {
            ble.write(
                app.peripheral_id,
                app.led.service,
                app.led.tile,
                data.buffer, app.onSuccess, app.onFailure
            );
        }
    },
    
    sendBrightness: function (value) {
        if(app.peripheral_id != 0)
        {
            var data = new Uint8Array(1);
            data[0] = value;
            ble.write(
                app.peripheral_id,
                app.led.service,
                app.led.brightness,
                data.buffer, app.onSuccess, app.onFailure
            );
        }
    },
    
    sendPower: function (value) {
        if(app.peripheral_id != 0)
        {
            var data = new Uint8Array(1);
            data[0] = value;
            ble.write(
                app.peripheral_id,
                app.led.service,
                app.led.power,
                data.buffer, app.onSuccess, app.onFailure
            );
        }
        if(app.button_id != 0)
        {
            var data = new Uint8Array(1);
            data[0] = value;
            ble.write(
                app.button_id,
                app.button.service,
                app.button.power,
                data.buffer, app.onSuccess, app.onFailure
            );
        }
    },
    
    updateBatteryLevel: function (callback) {
        if(app.peripheral_id != 0)
        {
            ble.read(
                app.peripheral_id,
                app.led.service,
                app.led.battery,
                function(raw) {
                    var data = new Uint8Array(raw);
                    callback(data);
                },
                app.onFailure
            );
        }
    },
    
    receiveButtonChange: function (raw) {
        var data = new Uint8Array(raw);
        if(data[0] == 0) {
            app.onButtonUp();
        }
        else {
            app.onButtonDown();
        }
    },
};

