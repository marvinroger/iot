import {helpers} from 'inversify-vanillajs-helpers'

export class Aqara {
  constructor () {
    this.name = 'Aqara'
    this.type = 'aqara'
  }

  init ({ language }) {
    this._language = language
  }

  restore (device) {

  }

  startDiscovery (discoverer) {

  }

  async handleAction (action) {

  }
}

helpers.annotate(Aqara)
