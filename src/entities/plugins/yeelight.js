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
    await device.setOnline(false)
  }

  startDiscovery (discoverer) {
    const yeelightSearch = new YeelightSearch()
    yeelightSearch.on('found', async (lightBulb) => {
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
      await this._discovered[id].device.setOnline(true)

      this._discovered[id].yeelightInstance.setRGB('#0000ff')
    })
  }

  async handleAction (action) {

  }
}

helpers.annotate(Yeelight)
