import mitt from 'mitt'

type Events = {
  'session-name-change': string
}

const emitter = mitt<Events>()

export default emitter