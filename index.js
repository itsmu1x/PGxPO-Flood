const DEFAULT_OPTIONS = {
    times: 3,
    resetTime: 30,
    waitTime: 60 * 25,
    ifFail: (req, res, next) => res.sendStatus(429),
    getKey: req => req.ip
}

class Flood {
    #flooders
    #floods
    #times
    #resetTime
    #waitTime
    #fail
    #getKey

    constructor(options = DEFAULT_OPTIONS) {
        if (!options) options = DEFAULT_OPTIONS
        options = { ...DEFAULT_OPTIONS, ...options }
        this.#floods = new Map()
        this.#flooders = new Map()
        this.#times = options.times
        this.#resetTime = options.resetTime
        this.#waitTime = options.waitTime
        this.#fail = options.ifFail
        this.#getKey = options.getKey
    }

    /**
     * 
     * @param {String} key 
     */
    check(key) {
        if (this.#flooders.has(key) && !this.#isWaitExpired(this.#flooders.get(key))) return false
        if (!this.#floods.has(key)) this.#floods.set(key, [])

        this.#floods.get(key).push(this.#getNow())
        const triesArray = this.#removedExpired(this.#floods.get(key))
        this.#floods.set(key, triesArray)
        const _c = triesArray.length < this.#times
        if (!_c) this.#flooders.set(key, this.#getWaitNow())
        return _c
    }

    middleware() {
        return (req, res, next) => {
            const _ = this.check(this.#getKey(req))
            if (!_) return this.#fail(req, res, next)
            next()
        }
    }

    #isWaitExpired(zxc) {
        return zxc <= this.#getNow()
    }

    #getWaitNow() {
        return this.#getNow() + this.#waitTime
    }

    #removedExpired(arr) {
        return arr.filter(d => (d + this.#resetTime) > this.#getNow())
    }

    #getNow() {
        return Math.floor(new Date().getTime() / 1000)
    }
}

export default Flood