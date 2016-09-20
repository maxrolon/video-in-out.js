import scroll from 'raf-scroll.js'
import loop from 'loop.js'

const inViewport = el => {
 let rect = el.getBoundingClientRect()
 return (rect.top < rect.height) && (rect.top + rect.height > 0)
}

const merge = defaults => overwrites => {
  Object.keys(overwrites).forEach( val => {
    defaults[val] = overwrites[val]
  })
  return defaults
}

const testState = el => el.readyState == 4

const setSrc = el => el.setAttribute('src', el.getAttribute('data-src') )

const events = loop()

export default (el, opts={}) => {
  const settings = merge({
    readyClass:'video-ready',
    parentEl:el.parentNode,
    autoload:true,
    fadeIn: el => {
      el.parentNode.classList.add('is-ready')
    }
  })(opts)

  let revealed = false
  let ready    = false
  let paused   = true

  let play = () => {
    if (ready){
      paused = false
      el.play()
      events.emit('play', el)
    } 
  }

  let pause = () => {
    paused = true
    el.pause()
    events.emit('pause', el)
  }

  let setReady = (value) => {
    if (!value) return
    ready = value

    if ( inViewport(el) ) play(el)
    if (!revealed){
      revealed = true
      events.emit('ready', el)
      settings.fadeIn(el)
    }
  }

  //Add src immediately
  if (settings.autoload) setSrc(el)

  scroll( (y, prevY) => {
    if ( inViewport(el) ){
      if ( !el.getAttribute('src') ){
        setSrc(el)
      }
      if (paused) play(el)
    } else {
      if (!paused) pause(el)
    }
  })

  el.addEventListener('canplaythrough', () => {
    setReady( testState(el) )
  })

  setReady( testState(el) )

  return {
    on: events.on,
    play:play,
    pause:pause,
    getReady: () => ready
  }
}
