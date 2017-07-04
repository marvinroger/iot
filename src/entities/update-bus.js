import {helpers} from 'inversify-vanillajs-helpers'

import {EventEmitter} from 'events'

export class UpdateBus extends EventEmitter {
  notify (type, id, value) {
    this.emit('update', { type, id, value })
  }
}

helpers.annotate(EventEmitter)
helpers.annotate(UpdateBus)
