import {helpers} from 'inversify-vanillajs-helpers'

export class Dummy {
  constructor () {
    this.name = 'Dummy'
    this.type = 'dummy'

    this._discovered = {}
  }

  init ({ language }) {
    this._language = language
  }

  async restore (device) {
    this._discovered[device.getCredentials().id] = { device }
    device.setOnline(false)
    await device.sync()
  }

  startDiscovery (discoverer) {
    setTimeout(async () => {
      const id = 'test'
      if (this._discovered[id] === undefined) {
        const device = await discoverer.discover({
          name: 'Dummy',
          actions: {},
          credentials: { id },
          properties: {}
        })

        this._discovered[id] = { device }
      }

      const device = this._discovered[id].device
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
    }, 1 * 1000)
  }

  async handleAction (action) {
  }
}

helpers.annotate(Dummy)
