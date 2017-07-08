import {helpers} from 'inversify-vanillajs-helpers'

import {Lookup as YeelightLookup} from 'node-yeelight-wifi'

const PROPERTY_ON = 'on'
const PROPERTY_INTENSITY = 'intensity'
const PROPERTY_COLOR = 'color'
const PROPERTIES = {
  [PROPERTY_ON]: {
    [PROPERTY_ON]: {
      name: 'Allumé',
      type: 'boolean',
      value: false
    }
  },
  [PROPERTY_INTENSITY]: {
    [PROPERTY_INTENSITY]: {
      name: 'Intensité',
      type: 'range',
      range: [0, 100],
      value: 100
    }
  },
  [PROPERTY_COLOR]: {
    [PROPERTY_COLOR]: {
      name: 'Couleur',
      type: 'color',
      value: [255, 255, 255]
    }
  }
}

const ACTION_TURN_ON = 'turnOn'
const ACTION_TURN_OFF = 'turnOff'
const ACTION_SET_INTENSITY = 'setIntensity'
const ACTION_SET_COLOR = 'setColor'
const ACTIONS = {
  [ACTION_TURN_ON]: {
    [ACTION_TURN_ON]: {
      name: 'Allumer'
    }
  },
  [ACTION_TURN_OFF]: {
    [ACTION_TURN_OFF]: {
      name: 'Éteindre'
    }
  },
  [ACTION_SET_INTENSITY]: {
    [ACTION_SET_INTENSITY]: {
      name: "Définir l'intensité",
      accepts: [
        { type: 'range', range: [0, 100] }
      ]
    }
  },
  [ACTION_SET_COLOR]: {
    [ACTION_SET_COLOR]: {
      name: 'Définir la couleur',
      accepts: [
        { type: 'color' }
      ]
    }
  }
}

const CREDENTIAL_ID = 'id'

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
    this._mapping[device.getId()] = device.getCredentials()[CREDENTIAL_ID]
    device.setOnline(false)
    await device.sync()
  }

  startDiscovery (discoverer) {
    const yeelightLookup = new YeelightLookup()
    yeelightLookup.on('detected', async (lightBulb) => {
      await lightBulb.setPower(false)

      const id = lightBulb.id
      if (this._discovered[id] === undefined) {
        const device = await discoverer.discover({
          name: 'Yeelight',
          actions: {},
          credentials: { [CREDENTIAL_ID]: id },
          properties: {},
          image: 'lamp'
        })

        this._discovered[id] = { device }
        this._mapping[device.getId()] = id
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
      device.clearProperties()
      device.setProperties({
        ...PROPERTIES[PROPERTY_ON]
      })

      device.clearActions()
      device.setActions({
        ...ACTIONS[ACTION_TURN_ON]
      })
      await device.sync()
    })
  }

  async handleAction (action) {
    const localId = this._mapping[action.deviceId]
    const discovered = this._discovered[localId]
    if (!discovered || !discovered.yeelightInstance) return

    const lightBulb = discovered.yeelightInstance
    const device = discovered.device

    if (action.action === ACTION_TURN_ON) {
      await lightBulb.setPower(true)
      device.clearProperties()
      device.setProperties({
        ...PROPERTIES[PROPERTY_ON],
        ...PROPERTIES[PROPERTY_INTENSITY],
        ...PROPERTIES[PROPERTY_COLOR]
      })
      device.setProperties({ [PROPERTY_ON]: { value: true } })

      device.clearActions()
      device.setActions({
        ...ACTIONS[ACTION_TURN_OFF],
        ...ACTIONS[ACTION_SET_INTENSITY],
        ...ACTIONS[ACTION_SET_COLOR]
      })
    } else if (action.action === ACTION_TURN_OFF) {
      await lightBulb.setPower(false)
      device.clearProperties()
      device.setProperties({
        ...PROPERTIES[PROPERTY_ON]
      })

      device.clearActions()
      device.setActions({
        ...ACTIONS[ACTION_TURN_ON]
      })
    } else if (action.action === ACTION_SET_INTENSITY) {
      const intensity = action.params[0]
      await lightBulb.setBright(intensity)
      device.setProperties({
        [PROPERTY_INTENSITY]: { value: intensity }
      })
    } else if (action.action === ACTION_SET_COLOR) {
      const rgb = action.params[0]
      await lightBulb.setRGB(rgb)
      device.setProperties({
        [PROPERTY_COLOR]: { value: rgb }
      })
    }

    await device.sync()
  }
}

helpers.annotate(Yeelight)
