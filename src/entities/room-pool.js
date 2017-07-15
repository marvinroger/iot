import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import {ROOM_UPDATE_TYPES} from '../../common/room-update-types'

export class RoomPool {
  constructor (roomFactory, metaModel, updateBus) {
    this._roomFactory = roomFactory
    this._Meta = metaModel.get()
    this._updateBus = updateBus

    this._rooms = new Map()
  }

  async forge ({ model, addPosition }) {
    const room = this._roomFactory()
    room._setModel(model)

    this._rooms.set(room.getId(), room)

    if (addPosition) {
      const roomsPositions = await this._Meta.where({ key: 'roomsPositions' }).fetch()
      const position = {x: 0, y: 0, w: 2, h: 2, i: room.getId().toString()}
      roomsPositions.attributes['value'].push(position)
      await roomsPositions.save()

      this._updateBus.notifyRoomUpdate({ type: ROOM_UPDATE_TYPES.ROOM_ADDED, id: room.getId(), name: room.getName(), position })
    }

    return room
  }

  async updatePositions (positions) {
    const roomsPositions = await this._Meta.where({ key: 'roomsPositions' }).fetch()
    roomsPositions.attributes['value'] = positions
    await roomsPositions.save()

    this._updateBus.notifyRoomUpdate({ type: ROOM_UPDATE_TYPES.ROOM_POSITIONS_REPLACED, positions })
  }

  getRooms () {
    return this._rooms.values()
  }

  getRoom (id) {
    return this._rooms.get(id)
  }
}

helpers.annotate(RoomPool, [TYPES.factories.Room, TYPES.models.Meta, TYPES.UpdateBus])
