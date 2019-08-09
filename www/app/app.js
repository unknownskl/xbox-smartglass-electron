const Smartglass = require('xbox-smartglass-core-node')
var SystemInputChannel = require('xbox-smartglass-core-node/src/channels/systeminput')
var SystemMediaChannel = require('xbox-smartglass-core-node/src/channels/systemmedia')
var TvRemoteChannel = require('xbox-smartglass-core-node/src/channels/tvremote')

module.exports = {

    _sgClient: false,

    start: function(){

        document.onkeydown = function(evt) {
            evt = evt || window.event;
            console.log('Pressed key:', evt.keyCode)

            if(this._sgClient != false){

                if(evt.keyCode == 72) {
                    this._sgClient.getManager('system_input').sendCommand('nexus').then(function(){
                        // Send button
                    }, function(error){
                        console.log(error)
                    });
                }

                if(evt.keyCode == 38) {
                    this._sgClient.getManager('system_input').sendCommand('up').then(function(){
                        // Send button
                    }, function(error){
                        console.log(error)
                    });
                }
                if(evt.keyCode == 37) {
                    this._sgClient.getManager('system_input').sendCommand('left').then(function(){
                        // Send button
                    }, function(error){
                        console.log(error)
                    });
                }
                if(evt.keyCode == 39) {
                    this._sgClient.getManager('system_input').sendCommand('right').then(function(){
                        // Send button
                    }, function(error){
                        console.log(error)
                    });
                }
                if(evt.keyCode == 40) {
                    this._sgClient.getManager('system_input').sendCommand('down').then(function(){
                        // Send button
                    }, function(error){
                        console.log(error)
                    });
                }

                if(evt.keyCode == 13 || evt.keyCode ==65) {
                    this._sgClient.getManager('system_input').sendCommand('a').then(function(){
                        // Send button
                    }, function(error){
                        console.log(error)
                    });
                }

                if(evt.keyCode == 8 || evt.keyCode ==66) {
                    this._sgClient.getManager('system_input').sendCommand('b').then(function(){
                        // Send button
                    }, function(error){
                        console.log(error)
                    });
                }
            }
        }.bind(this);

    },

    scan: function(){
        var sgClient = new Smartglass();
        document.getElementById('consoleList').innerHTML = 'Searching...';

        sgClient.discovery().then(function(consoles){
            document.getElementById('consoleList').innerHTML = '';

            for(var xbox in consoles){
                console.log('- Device found: ' + consoles[xbox].message.name);
                console.log('  Address: '+ consoles[xbox].remote.address + ':' + consoles[xbox].remote.port);

                var li = document.createElement("li");
                li.setAttribute("onclick", 'App.connect(\''+consoles[xbox].remote.address+'\')')
                li.appendChild(document.createTextNode(consoles[xbox].message.name));

                document.getElementById('consoleList').append(li)
            }
            if(consoles.length == 0){
                document.getElementById('consoleList').innerHTML = 'No consoles found';

                console.log('No consoles found on the network')
            }
        }).catch(function(error){
            console.log('app.scan error:', error)
        });
    },

    connect: function(ip){
        console.log('Connecting to ip:', ip);
        this._sgClient = new Smartglass();
        this._sgClient.connect('192.168.2.5').then(function(){
            console.log('Xbox succesfully connected!');
            this._sgClient.addManager('system_input', SystemInputChannel())
            this._sgClient.addManager('system_media', SystemMediaChannel())
            this._sgClient.addManager('tv_remote', TvRemoteChannel())

            document.getElementById('connectionStatus').innerHTML = 'Connected'

            this._sgClient.on('_on_console_status', function(message, xbox, remote, smartglass){
                if(message.packet_decoded.protected_payload.apps[0] != undefined){
                    document.getElementById('currentApp').innerHTML = message.packet_decoded.protected_payload.apps[0].aum_id
                }
            })
        }.bind(this)).catch(function(error){
            console.log('app.connect error:', error)
        });;
    }

}
