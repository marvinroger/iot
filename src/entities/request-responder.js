import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import {generateResponse, generateEvent} from '../../common/ws-messages'
import {EVENT_TYPES} from '../../common/event-types'
import {DEVICE_UPDATE_TYPES} from '../../common/device-update-types'
import {ROOM_UPDATE_TYPES} from '../../common/room-update-types'

export class RequestResponder {
  constructor (devicePool, roomPool, roomModel, metaModel) {
    this._devicePool = devicePool
    this._roomPool = roomPool
    this._Room = roomModel.get()
    this._Meta = metaModel.get()
  }

  async sendInitialMessages (ws) {
    for (const device of this._devicePool.getDevices()) {
      ws.send(generateEvent(
        EVENT_TYPES.DEVICE_UPDATE,
        {
          type: DEVICE_UPDATE_TYPES.DEVICE_ADDED,
          id: device.getId(),
          value: {
            id: device.getId(),
            online: device.getOnline(),
            name: device.getName(),
            properties: device.getProperties(),
            actions: device.getActions(),
            image: device.getImage()
          }
        }
      ))
    }

    const roomsPositions = await this._Meta.where({ key: 'roomsPositions' }).fetch()

    for (const room of this._roomPool.getRooms()) {
      const roomPosition = roomsPositions.attributes['value'].filter(elem => elem.i === room.getId().toString())[0]
      ws.send(generateEvent(
        EVENT_TYPES.ROOM_UPDATE,
        {
          type: ROOM_UPDATE_TYPES.ROOM_ADDED,
          id: room.getId().toString(),
          name: room.getName(),
          position: roomPosition
        }
      ))
    }
  }

  async handle ({ request, ws, user }) {
    const {method, parameters} = request
    const sendResponse = response => ws.send(generateResponse(request, response))

    if (method === 'triggerAction') {
      const {action, deviceId, params} = parameters

      const device = this._devicePool.getDevice(deviceId)
      if (!device) return sendResponse(false)

      device.getPlugin().handleAction({
        deviceId,
        action,
        params
      })

      sendResponse(true)
    } else if (method === 'addRoom') {
      const {name} = parameters

      const roomModel = await this._Room.forge({
        name
      }).save()

      const room = await this._roomPool.forge({ model: roomModel, addPosition: true })

      sendResponse({
        id: room.getId().toString(),
        name
      })
    } else if (method === 'updateRoomsPositions') {
      const {positions} = parameters

      await this._roomPool.updatePositions(positions)

      sendResponse(true)
    }
  }
}

helpers.annotate(RequestResponder, [TYPES.DevicePool, TYPES.RoomPool, TYPES.models.Room, TYPES.models.Meta])
