import Smartglass from 'xbox-smartglass-core-node'

export default {
  devicesFound: {},
  clients: {},

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
  },

  getConnection (address) {
    return this.clients[address]
  },

  connect (ip, name, app) {
    console.log(this.clients)

    return new Promise(function (resolve, reject) {
      if (this.clients[ip] !== undefined) {
        resolve(this.clients[ip])
      } else {
        this.clients[ip] = {
          client: Smartglass(),
          console_status: {},
          media_status: {},
          name: name
        }

        this.clients[ip].client.connect(ip).then(function () {
          this.clients[ip].client.on('_on_console_status', function (message, xbox, remote, smartglass) {
            if (message.packet_decoded.protected_payload.apps[0] !== undefined) {
              this.clients[remote.address].console_status = message.packet_decoded.protected_payload
              // console.log(app, remote)

              // if(deviceStatus.current_app != message.packet_decoded.protected_payload.apps[0].aum_id){
              //   deviceStatus.current_app = message.packet_decoded.protected_payload.apps[0].aum_id
              //   console.log('xbox: Current active app:', deviceStatus)
              // }

              console.log('xbox: Current active app:', message.packet_decoded.protected_payload)
              app.$root.$emit('Smartglass_Console_Status', remote, message.packet_decoded.protected_payload)
            }
          }.bind(this))

          resolve(this.clients[ip].client)
        }.bind(this), function (error) {
          this.clients[ip] = undefined
          this.console_status[ip] = undefined

          reject(error)
        }.bind(this))
      }
    }.bind(this))
  },

  disconnect (ip, app) {
    console.log(this.clients)

    return new Promise(function (resolve, reject) {
      if (this.clients[ip] !== undefined) {
        this.clients[ip].client.disconnect()

        app.$root.$emit('Smartglass_Console_Disconnect', { address: ip })
        this.clients[ip] = undefined

        resolve(true)
      } else {
        reject('Not Connected')
      }
    }.bind(this))
  }
}
