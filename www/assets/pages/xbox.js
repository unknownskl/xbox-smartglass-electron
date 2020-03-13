function openRemoteTab(cityName) {
  var i;
  var x = document.getElementsByClassName("remote-tab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(cityName).style.display = "block";
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
    })
}, 1000)
