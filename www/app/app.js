const Smartglass = require('xbox-smartglass-core-node')
var SystemInputChannel = require('xbox-smartglass-core-node/src/channels/systeminput')
var SystemMediaChannel = require('xbox-smartglass-core-node/src/channels/systemmedia')
var TvRemoteChannel = require('xbox-smartglass-core-node/src/channels/tvremote')

var XboxApiClient = require('xbox-webapi');
var TokenStore = require('xbox-webapi/src/tokenstore.js');

const Store = require('electron-store');
const appStorage = new Store();

const querystring = require('querystring');
var shell = require('electron').shell;

module.exports = {

    _sgClient: false,
    _webClient: false,
    _authWindow: false,

    _status: {},

    _friends: {},

    start: function(){

        this.loadView('home')
        this.loadUser()
        this.scan()

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
        document.getElementById('consoleList').innerHTML = '<a class="nav-group-item"><span class="icon icon-arrows-ccw"></span> Searching...</a>';

        sgClient.discovery().then(function(consoles){
            document.getElementById('consoleList').innerHTML = '';

            for(var xbox in consoles){
                console.log('- Device found: ' + consoles[xbox].message.name);
                console.log('  Address: '+ consoles[xbox].remote.address + ':' + consoles[xbox].remote.port);

                var button = document.createElement("a");
                button.setAttribute("onclick", 'this.setAttribute("class", "nav-group-item active"); App.connect("'+consoles[xbox].remote.address+'", "'+consoles[xbox].message.name+'");')
                button.setAttribute("class", 'nav-group-item')
                button.innerHTML = '<span class="icon icon-home"></span>'
                button.appendChild(document.createTextNode(consoles[xbox].message.name));

                document.getElementById('consoleList').append(button)
            }
            if(consoles.length == 0){
                var button = document.createElement("a");
                // button.setAttribute("onclick", 'this.setAttribute("class", "nav-group-item active"); App.connect("'+consoles[xbox].remote.address+'");')
                button.setAttribute("class", 'nav-group-item')
                button.innerHTML = '<span class="icon icon-cancel"></span>'
                button.appendChild(document.createTextNode('No consoles found'));

                document.getElementById('consoleList').append(button)

                console.log('No consoles found on the network')
            }
        }).catch(function(error){
            console.log('app.scan error:', error)
        });
    },

    disconnect: function(){
        this._sgClient.disconnect();
        document.getElementById('consoleStatus').remove()
        this.loadView('home')
    },

    connect: function(ip, name){
        console.log('Connecting to ip:', ip);

        // Check auth
        var uhs = undefined
        var jwt = undefined

        var token_store = TokenStore(appStorage.path.substr(0, appStorage.path.length-11)+'.tokens.json')
        token_store.load()
        var xsts_token = token_store.get('xsts_token')

        uhs = xsts_token.DisplayClaims.xui[0].uhs
        jwt = xsts_token.Token

        console.log('XSTS TOKEN:', token_store.get('xsts_token'))

        this._sgClient = new Smartglass();
        this._sgClient.connect(ip, uhs, jwt).then(function(){
            console.log('Xbox succesfully connected!');
            this._sgClient.addManager('system_input', SystemInputChannel())
            this._sgClient.addManager('system_media', SystemMediaChannel())
            this._sgClient.addManager('tv_remote', TvRemoteChannel())

            // document.getElementById('connectionStatus').innerHTML = 'Connected'

            this._sgClient.on('_on_media_state', function(message, xbox, remote, smartglass){
                // console.log('Media state:', message)
                this._status.media_state = message.packet_decoded.protected_payload
                this.setConsoleStatus()
            }.bind(this))

            this._sgClient.on('_on_console_status', function(message, xbox, remote, smartglass){
                if(message.packet_decoded.protected_payload.apps[0] != undefined){
                    this._status.console_status = message.packet_decoded.protected_payload
                    this.setConsoleStatus()

                    // document.getElementById('currentApp').innerHTML = message.packet_decoded.protected_payload.apps[0].aum_id
                }
            }.bind(this))

            this._sgClient.on('_on_timeout', function(message, xbox, remote, smartglass){
                console.log('Client timeout. Reconnecting...')
                // this.disconnect();
                this.connect(ip)
            }.bind(this))

            this.loadView('xbox', function(){
                document.getElementById('xbox-name').innerHTML = name
            }.bind(this))

        }.bind(this)).catch(function(error){
            console.log('app.connect error:', error)
        });;
    },

    userAuth: function(){
        this.loadView('userauth')

        // setTimeout(function(){
        //     shell.openExternal('https://login.live.com/oauth20_authorize.srf?client_id=0000000048093EE3&redirect_uri=https%3A%2F%2Flogin.live.com%2Foauth20_desktop.srf&response_type=token&display=touch&scope=service%3A%3Auser.auth.xboxlive.com%3A%3AMBI_SSL&locale=en');
        // }, 3000)
    },

    userAuthUrl: function(url, success_callback, error_callback){
        console.log('got url:', url)

        var format_querystring = url.split('#')
        var results = querystring.parse(format_querystring[1])

        // console.log(results.access_token, results.refresh_token)
        var token_store = TokenStore(appStorage.path.substr(0, appStorage.path.length-11)+'.tokens.json')
        console.log(token_store)
        token_store.set('access_token', results.access_token)
        token_store.set('refresh_token', results.refresh_token)
        token_store.delete('user_token')
        token_store.delete('xsts_token')
        token_store.save()
        console.log('token_store saved', token_store)

        this._webClient = XboxApiClient(token_store)
        console.log('Attempting to login...')

        // Check auth
        this._webClient.authenticate().then(function(user_info){
            console.log('Logged in as: '+user_info.gtg+'')
            token_store.save()
            console.log('token_store saved', token_store)
            success_callback()

            this.loadUser()
        }.bind(this)).catch(function(error){
            console.log('Authentication failed:', error)
            error_callback()
        })

        // setTimeout(function(){
        //     shell.openExternal('https://login.live.com/oauth20_authorize.srf?client_id=0000000048093EE3&redirect_uri=https%3A%2F%2Flogin.live.com%2Foauth20_desktop.srf&response_type=token&display=touch&scope=service%3A%3Auser.auth.xboxlive.com%3A%3AMBI_SSL&locale=en');
        // }, 3000)
    },

    loadIrConfiguration: function(callback){
        this._sgClient.getManager('tv_remote').getConfiguration().then(function(configuration){
            console.log('configuration', configuration)
            callback(configuration)
        }, function(error){
            console.log('error', error)
        });

    },

    loadUser: function(){

        var token_store = TokenStore(appStorage.path.substr(0, appStorage.path.length-11)+'.tokens.json')
        this._webClient = XboxApiClient(token_store)

        console.log('token_store', token_store)

        if(!token_store.tokens.user_token){

            var html = '<li class="list-group-item" onclick="App.userAuth()">'
                html += '<img class="img-circle media-object pull-left" src="assets/images/avatar.png" width="32" height="32">'
                html += '  <div class="media-body">'
                html += '    <strong>Not authenticated</strong>'
                html += '    <p>Click here to authenticate</p>'
                html += '  </div>'
                html += '</li>'

            document.getElementById('userAccounts').innerHTML = html

        } else {

            var html = '<li class="list-group-item">'
                html += '<img class="img-circle media-object pull-left" src="assets/images/avatar.png" width="32" height="32">'
                html += '  <div class="media-body">'
                html += '    <strong>Authenticating...</strong>'
                html += '    <p onclick="App.userAuth()">Click here to re-authenticate</p>'
                html += '  </div>'
                html += '</li>'

            document.getElementById('userAccounts').innerHTML = html

            this._webClient.authenticate().then(function(user_info){
                token_store.save()
                console.log('token_store saved', token_store)
                console.log('user_info', user_info)

                this._webClient.provider('profile').get_gamertag_profile(user_info.gtg).then(function(data){
                    var html = '<li class="list-group-item">'
                        html += '<img class="img-circle media-object pull-left" id="user_avatar" src="'+data.profileUsers[0].settings[1].value+'" width="32" height="32">'
                        html += '  <div class="media-body">'
                        html += '    <strong>'+user_info.gtg+'</strong>'
                        html += '    <p>User Online</p>'
                        html += '  </div>'
                        html += '</li>'

                    document.getElementById('userAccounts').innerHTML = html

                    // Auth ok..  Load friends..
                    this.loadFriends()
                }.bind(this)).catch(function(error){
                    console.log('error fail_load_profile', error)
                })
            }.bind(this)).catch(function(error){
                console.log('error recovery_fail', error)

                var html = '<li class="list-group-item">'
                    html += '<img class="img-circle media-object pull-left" src="assets/images/avatar.png" width="32" height="32">'
                    html += '  <div class="media-body">'
                    html += '    <strong>Failed to authenticate. Token expired</strong>'
                    html += '    <p onclick="App.userAuth()">Click here to re-authenticate</p>'
                    html += '  </div>'
                    html += '</li>'

                document.getElementById('userAccounts').innerHTML = html
            })
        }

    },

    loadFriends: function(){
        var token_store = TokenStore(appStorage.path.substr(0, appStorage.path.length-11)+'.tokens.json')
        var client = XboxApiClient(token_store)
    
        console.log('token_store',token_store)
    
        client.authenticate().then(function(user_info){
            document.getElementById('onlineFriendAccounts').innerHTML = ''
            document.getElementById('offlineFriendAccounts').innerHTML = ''
    
            client.provider('profile').get_friends_by_xuid(client.auth_manager.xsts_token.DisplayClaims.xui[0].xid).then(function(friends){

                // console.log(friends)

                this._friends = {}

                for(let friend in friends.profileUsers){
                    this._friends[friends.profileUsers[friend].id] = {}

                    for(let setting in friends.profileUsers[friend].settings){
                        
                        this._friends[friends.profileUsers[friend].id][
                            friends.profileUsers[friend].settings[setting].id
                        ] = friends.profileUsers[friend].settings[setting].value
                    }
                }

                // Load presence...

                var xuid_list = []
                for(let xuid in this._friends){
                    xuid_list.push(xuid)
                }

                client.provider('userpresence').get_presence_batch(xuid_list).then(function(data){
                    console.log('presence: ', data)

                    for(let entry in data){
                        
                        if(this._friends[data[entry].xuid] != undefined){
                            
                            this._friends[data[entry].xuid].Presence = data[entry].state,
                            this._friends[data[entry].xuid].lastSeen = data[entry].lastSeen,
                            this._friends[data[entry].xuid].Devices = data[entry].devices
                        }
                    }

                    // Draw friends
                    friends = this._friends
                    for(let xuid in friends){
        
                        //client.provider('profile').get_user_profile(xuid).then(function(data){
                        // console.log(friends[xuid])

                        var html = '<li class="list-group-item">'
                            html += '<img class="img-circle media-object pull-left" id="user_avatar" src='+friends[xuid].PublicGamerpic+' width="32" height="32">'
                            html += '  <div class="media-body">'
                            html += '    <strong>'+friends[xuid].Gamertag+'</strong>'
                            if(friends[xuid].lastSeen != undefined){

                                var lastseen = new Date(friends[xuid].lastSeen.timestamp)
                                var now = new Date()
                                
                                html += '    <p>'+friends[xuid].Presence+' - Last seen: '+friends[xuid].lastSeen.titleName+' on '+friends[xuid].lastSeen.deviceType+'</p>'
                                
                                var diffHours = (((now-lastseen)/1000)/60/60)
                                if(diffHours < 1){
                                    var minutes = diffHours*60
                                    html += '    <p>'+Math.floor(minutes)+' minutes ago</p>'
                                } else if(diffHours > 24) {
                                    var days = diffHours/24
                                    html += '    <p>'+Math.floor(days)+' days ago</p>'
                                } else {
                                    html += '    <p>'+Math.floor(diffHours)+' hours ago</p>'
                                }
                            } else {
                                html += '    <p>'+friends[xuid].Presence+'</p>'
                            }

                            if(friends[xuid].Devices != undefined){
                                for(let device in friends[xuid].Devices){
                                    if(friends[xuid].Devices[device].type == 'XboxOne'){
                                        var devicetype = 'XboxOne'

                                    } else if(friends[xuid].Devices[device].type == 'WindowsOneCore'){
                                        var devicetype = 'PC'
                                    } else {
                                        var devicetype = friends[xuid].Devices[device].type
                                    }

                                    for(let title in friends[xuid].Devices[device].titles){
                                        if(friends[xuid].Devices[device].titles[title].placement == 'Full'){
                                            html += '    <p>'+devicetype+' - '+friends[xuid].Devices[device].titles[title].name+'</p>'

                                            if(friends[xuid].Devices[device].titles[title].activity != undefined && friends[xuid].Devices[device].titles[title].activity.richPresence != undefined){
                                                html += '    <p>'+friends[xuid].Devices[device].titles[title].activity.richPresence+'</p>'
                                            }
                                        }
                                    }

                                    // html += '    <p>XboxOne - '+JSON.stringify(friends[xuid].Devices[device])+'</p>'
                                }
                            }

                            html += '  </div>'
                            html += '</li>'

                        if(friends[xuid].Presence == 'Offline')
                            document.getElementById('offlineFriendAccounts').innerHTML = document.getElementById('offlineFriendAccounts').innerHTML+html
                        else
                            document.getElementById('onlineFriendAccounts').innerHTML = document.getElementById('onlineFriendAccounts').innerHTML+html
        
                        // }.bind(this)).catch(function(error){
                        //     console.log('error', error)
                        // })
        
                    }

                }).catch(function(error){
                    console.log('error', error)
                })

            }).catch(function(error){
                console.log('error', error)
            })
        }).catch(function(error){
            console.log(error)
        })
    },

    loadView: function(view, callback){
        fetch('assets/pages/'+view+'.html')
        .then((response) => {
            response.text().then(function(data){
                document.getElementById('content').innerHTML = data

                const scriptPromise = new Promise((resolve, reject) => {
                  const script = document.createElement('script');
                  document.body.appendChild(script);
                  script.onload = resolve;
                  script.onerror = reject;
                  script.async = true;
                  script.src = 'assets/pages/'+view+'.js';
                });

                scriptPromise.then(() => {

                });

                if(callback != undefined){
                    callback()
                }
            });
        });
    },

    setConsoleStatus: function(){

        var status = this._status.console_status
        var media_state = this._status.media_state
        console.log('status', status)
        console.log('media_state', media_state)

        this._webClient.provider('titlehub').get_title(status.apps[0].title_id).then(function(response){

            console.log('Loaded title:', response)
            var current_title = response.titles[0]

            var html = '<div class="toolbar-actions" id="consoleStatus">'
                html += '   <img src="'+current_title.displayImage+'" class="status-image"/>'
                html += '   <div class="media_status">'
                html += '       <h1>'+current_title.name+' <small>('+current_title.type+')</small></h1>'
                html += '       <p>'
                html += '           Publisher: '+current_title.detail.publisherName+'<br />'

                if(current_title.detail.developerName)
                    html += '           Developer: '+current_title.detail.developerName+''

                html += '       </p>'
                html += '   </div>'

                if(media_state !=  undefined){
                    html += '   <div class="media_state">'
                    html += '       <p>'
                    html += '           App: '+media_state.aum_id+'<br />'
                    html += '           media_type: '+media_state.media_type+'<br />'
                    html += '           sound_level: '+media_state.sound_level+'<br />'
                    html += '           playback_status: '+media_state.playback_status+'<br />'
                    html += '           <br />'

                    for(meta in media_state.metadata){
                        html += '           metadata['+media_state.metadata[meta].name+']: '+media_state.metadata[meta].value+'<br />'
                    }

                    html += '       </p>'
                    html += '   </div>'
                } else {

                    // html += '   <div class="media_state">'
                    // html += '       <p>'
                    // html += '           No media is currently playing'
                    // html += '       </p>'
                    // html += '   </div>'
                }

                html += '</div>'

            document.getElementById('footer').innerHTML = html
        }.bind(this))
    },

    sendIrCommand: function(button, device_id){
        this._sgClient.getManager('tv_remote').sendIrCommand(button, device_id).then(function(button){
            console.log(button)
        }, function(error){
            console.log(error)
        });
    },

    recordGameDvr: function(){
        this._sgClient.recordGameDvr().then(function(status){
            console.log(status)
        }, function(error){
            console.log(error)
        });
    }

}
