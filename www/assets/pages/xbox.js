function openRemoteTab(device_type) {
    var i;
    var x = document.getElementsByClassName("remote-tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(device_type).style.display = "block";

    for(device in remote_configuration){

        console.log()
        if(remote_configuration[device].device_type == device_type){
            var buttons = remote_configuration[device].buttons;

            drawRemoteButtons(remote_configuration[device])
        }
    }
}

var remote_configuration = {}

setTimeout(function(){
    App.loadIrConfiguration(function(configuration){
        remote_configuration = configuration

        for(device in remote_configuration){
            console.log(remote_configuration[device].device_id,
                        remote_configuration[device].device_type,
                        remote_configuration[device].device_brand,
                        remote_configuration[device].device_model,
                        remote_configuration[device].device_name,
                        remote_configuration[device].buttons)
        }

        openRemoteTab('stb')
    })
}, 1000)

function drawRemoteButtons(configuration) {
    console.log('Draw buttons for:', configuration)

    if(configuration.device_brand && configuration.device_model){
        var title = configuration.device_brand+ ' ('+configuration.device_model+')';

    } else if(configuration.device_brand ){
        var title = configuration.device_type.toUpperCase()+': '+configuration.device_brand;
    } else {
        var title = configuration.device_type.toUpperCase();
    }

    document.getElementById('remote-'+configuration.device_type+'-title').innerHTML = title;

    var buttons_other = '';
    var buttons_volume = '';
    var buttons_channels = '';
    var buttons_control = '';
    for(button in configuration.buttons){
        switch(button) {
            case 'btn.vol_up':
                buttons_volume += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;
            case 'btn.vol_down':
                buttons_volume += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;
            case 'btn.vol_mute':
                buttons_volume += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;

            case 'btn.ch_down':
                buttons_channels += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;
            case 'btn.ch_up':
                buttons_channels += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;

            case 'btn.back':
                buttons_control += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;
            case 'btn.menu':
                buttons_control += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;
            case 'btn.power':
                buttons_control += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;
            case 'btn.up':
                buttons_control += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;
            case 'btn.down':
                buttons_control += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;
            case 'btn.left':
                buttons_control += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;
            case 'btn.right':
                buttons_control += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
                break;
            default:
                buttons_other += ' <button onclick="App.sendIrCommand(\''+button+'\', \''+configuration.device_id+'\')">'+configuration.buttons[button]+'</button>'
        }
    }

    var remote_html = '';
    if(buttons_volume != ''){
        remote_html += '<h4>Volume</h4>'+buttons_volume+'<br />'
    }
    if(buttons_channels != ''){
        remote_html += '<h4>Channels</h4>'+buttons_channels+'<br />'
    }
    if(buttons_control != ''){
        remote_html += '<h4>Control</h4>'+buttons_control+'<br />'
    }

    remote_html += '<br /> '+buttons_other;

    document.getElementById('remote-'+configuration.device_type+'-buttons').innerHTML = remote_html;
}
