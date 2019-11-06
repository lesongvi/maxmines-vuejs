import store from '../store'

const stats = {}
let miner = {}

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
  miner.start()
  setInterval(updateStats, 500)
}
