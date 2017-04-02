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
        value: 'A001'
    },
    initialize: function() {
        this.peripheral_id = 0;
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
            ble.startScan([app.led.service], onScan, null);
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
        app.logStatus('success');
    },
    onFailure: function(reason) {
        app.logStatus('fail ' + reason);
    },
    onConnect: function(peripheral) {
        app.logStatus('Connected to ' + peripheral.id);
        app.peripheral_id = peripheral.id;
        
        ble.stopScan(function() {app.scanning = false});

        app.onConnectCallback();
    },
    onDisconnect: function(reason) {
        app.logStatus('Disconnected ' + reason);
        app.scan();
    },
    
    sendData: function (data) {
        //app.logStatus('Sending ' + data);
        if(app.peripheral_id != 0)
        {
            ble.write(
                app.peripheral_id,
                app.led.service,
                app.led.value,
                data.buffer, app.onSuccess, app.onFailure
            );
        }
    },
};

