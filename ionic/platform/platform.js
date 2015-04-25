import * as util from 'ionic/util'

const queryPlatform = (util.readQueryParams()['ionicplatform'] || '').toLowerCase()

class Platform {
  constructor(options) {
    util.extend(this, options)
  }
}

class PlatformController {
  constructor() {
    this.registry = {}
  }

  set(platform) {
    this.current = platform
  }

  get() {
    return this.current
  }

  getName() {
    return this.current && this.current.name
  }

  register(platform) {
    if (!platform instanceof Platform) platform = new Platform(platform)
    this.registry[platform.name] = platform
  }

  setDefaultPlatform(platform) {
    if (!platform instanceof Platform) platform = new Platform(platform)
    this.defaultPlatform = platform
  }

  isRegistered(platformName) {
    return this.registry.some(platform => {
      return platform.name === platformName
    })
  }

  detect() {
    for (let name in this.registry) {
      if (this.registry[name].isMatch()) {
        return this.registry[name]
      }
    }
    return this.defaultPlatform
  }
}

export let platform = new PlatformController()

// TODO(ajoslin): move this to a facade somewhere else?
var ua = window.navigator.userAgent

// TODO(ajoslin): move these to their own files
platform.register({
  name: 'android',
  isMatch() {
    return queryPlatform == 'android' || /android/i.test(ua)
  }
})
platform.register({
  name: 'ios',
  isMatch() {
    return queryPlatform === 'ios' || /ipad|iphone|ipod/i.test(ua)
  }
})

// Last case is a catch-all
platform.setDefaultPlatform({
  name: 'core'
})

platform.set( platform.detect() )
