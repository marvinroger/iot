import {helpers} from 'inversify-vanillajs-helpers'

import {Lookup as YeelightLookup} from 'node-yeelight-wifi'

export class Yeelight {
  constructor () {
    this.name = 'Yeelight'
    this.type = 'yeelight'

    this._discovered = {}
    this._mapping = {}
  }

  init ({ language }) {
    this._language = language
  }

  async restore (device) {
    this._discovered[device.getCredentials().id] = { yeelightInstance: null, device }
    this._mapping[device.getId()] = device.getCredentials().id
    device.setOnline(false)
    await device.sync()
  }

  startDiscovery (discoverer) {
    const yeelightLookup = new YeelightLookup()
    yeelightLookup.on('detected', async (lightBulb) => {
      const id = lightBulb.id
      if (this._discovered[id] === undefined) {
        const device = await discoverer.discover({
          name: 'Yeelight',
          actions: {},
          credentials: { id },
          properties: {}
        })

        this._discovered[id] = { device }
      }

      this._discovered[id].yeelightInstance = lightBulb

      const device = this._discovered[id].device

      let reconnectInterval = null
      lightBulb.on('disconnected', async () => {
        device.setOnline(false)
        await device.sync()

        reconnectInterval = setInterval(() => {
          lightBulb.connect()
        }, 10000)
      })

      lightBulb.on('connected', async () => {
        clearInterval(reconnectInterval)
        device.setOnline(true)
        await device.sync()
      })

      device.setOnline(true)
      device.setProperties({
        on: {
          name: 'Allumé',
          type: 'boolean',
          value: true
        },
        intensity: {
          name: 'Intensité',
          type: 'range',
          range: [0, 100],
          value: 50
        },
        color: {
          name: 'Couleur',
          type: 'color',
          value: [255, 0, 0]
        }
      })
      device.setActions({
        turnOff: {
          name: 'Éteindre'
        },
        setIntensity: {
          name: "Définir l'intensité",
          accepts: [
            { type: 'range', range: [0, 100] }
          ]
        },
        setColor: {
          name: 'Définir la couleur',
          accepts: [
            { type: 'color' }
          ]
        }
      })
      await device.sync()
    })
  }

  async handleAction (action) {
    const localId = this._mapping[action.deviceId]
    const discovered = this._discovered[localId]
    if (!discovered || !discovered.yeelightInstance) return

    const lightBulb = discovered.yeelightInstance

    if (action.action === 'setColor') {
      const rgb = action.params[0]
      await lightBulb.setRGB(rgb)
    }
  }
}

helpers.annotate(Yeelight)
