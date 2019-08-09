const Smartglass = require('xbox-smartglass-core-node')
var SystemInputChannel = require('xbox-smartglass-core-node/src/channels/systeminput')
var SystemMediaChannel = require('xbox-smartglass-core-node/src/channels/systemmedia')
var TvRemoteChannel = require('xbox-smartglass-core-node/src/channels/tvremote')

module.exports = {

    _sgClient: false,

    start: function(){
    },

    scan: function(){
        var sgClient = new Smartglass();
        document.getElementById('consoleList').innerHTML = 'Searching...';

        sgClient.discovery(function(consoles){
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
        });
    },

    connect: function(ip){
        console.log('Connecting to ip:', ip);
        this._sgClient = new Smartglass();
        this._sgClient.connect('192.168.2.5', function(result){
            if(result === true){
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
            }
        }.bind(this));
    }

}
