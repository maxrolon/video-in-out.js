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

const isRetina = ( window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI ) > 1

const testState = el => el.readyState == 4

const setSrc = el => {
  let src
  if ( ( src = el.getAttribute('data-src'), src ).indexOf(',') > -1 ){
    let urls = src.split(',').reduce( ( obj, val ) => {
      let temp = val.replace(/^ |w$/g, '').split(' ')
      obj[ temp[1] ] = temp[0]
      return obj
    }, {} )

    let width = window.innerWidth * ( isRetina ? 1.5 : 1 )

    let nextLargest = Object.keys( urls ).reduce( ( a, b ) => {
      if ( a > width ) return a
      return b
    } )

    el.setAttribute('src', urls[ nextLargest ] )
  } else {
    el.setAttribute('src', src )
  }
}

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
