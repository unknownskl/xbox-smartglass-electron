import Smartglass from 'xbox-smartglass-core-node'

export default {
  devicesFound: {},

  discovery (ip) {
    return new Promise(function (resolve, reject) {
      var SGClient = Smartglass()

      SGClient.discovery(ip).then(function (devices) {
        var newDevices = {}

        for (var device in devices) {
          console.log(devices[device])

          newDevices[devices[device].remote.address] = {
            name: devices[device].message.name,
            uuid: devices[device].message.uuid,
            flags: devices[device].message.flags,
            last_error: devices[device].message.last_error,
            certificate: devices[device].message.certificate,
            address: devices[device].remote.address
          }
        }

        this.devicesFound = newDevices
        resolve(newDevices)
      }.bind(this), function (error) {
        reject(error)
      })
    }.bind(this))
  }
}
