import store from '../store'
import getTS from './getTS'

const stats = {}
let miner = {}

function hashFound () {
  store.commit('addMessage', `${getTS()} - Found hashes!`)
}

function hashAccepted () {
  store.commit('addMessage', `Accepted hashes!`)
}

function onOptin (params) {
  if (params.status === 'accepted') {
    store.commit('addMessage', 'Người dùng chấp nhận đào')
  } else {
    store.commit('addMessage', 'Người dùng không chấp nhận đào')
  }
}

function newJob () {
  store.commit('addMessage', `Job mới!!`)
}

function updateThrottle () {
  miner.setThrottle(store.state.throttle)
}

function updateStats () {
  updateThrottle()
  stats.hashesPerSecond = miner.getHashesPerSecond()
  stats.hasWASM = miner.hasWASMSupport()
  stats.threads = miner.getNumThreads()
  stats.totalHashes = miner.getTotalHashes(true)
  stats.throttle = miner.getThrottle()
  stats.power = `${((1 - stats.throttle).toFixed(2) * 100)}%`
  stats.hashRate = stats.hashesPerSecond.toFixed(1)
  store.commit('updateStats', stats)
}

export default function (MM, ctx) {
  const opts = { throttle: store.state.throttle }
  miner = new MM.Anonymous(ctx.$config.siteKey, opts)
  miner.on('error', ev => console.log({ error: ev }))
  miner.on('open', () => console.log({ state: 'started' }))
  miner.on('close', () => console.log({ state: 'closed' }))
  miner.on('found', () => hashFound())
  miner.on('job', () => newJob())
  miner.on('accepted', () => hashAccepted())
  miner.on('optin', ev => onOptin(ev))
  miner.start()
  setInterval(updateStats, 500)
}
