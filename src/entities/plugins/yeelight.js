import {helpers} from 'inversify-vanillajs-helpers'

import YeelightSearch from 'yeelight-wifi'

export class Yeelight {
  constructor () {
    this.name = 'Yeelight'
    this.type = 'yeelight'

    this._discovered = {}
  }

  async restore (device) {
    this._discovered[device.getCredentials().id] = { yeelightInstance: null, device }
    device.setOnline(false)
    await device.sync()
  }

  startDiscovery (discoverer) {
    const yeelightSearch = new YeelightSearch()
    yeelightSearch.on('found', async (lightBulb) => {
      await lightBulb.turnOff()
      const id = lightBulb.getId()
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

      lightBulb.on('notifcation', () => {
        device.setOnline(false)
        device.sync()
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

  }
}

helpers.annotate(Yeelight)
