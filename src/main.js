import scroll from 'raf-scroll.js'
import knot from 'knot.js'

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

const addClass = (cssClass, el) => el.classList.add(cssClass)

const fadeIn = el => {
  //let innerEl = document.querySelector('.js-hero-inner')
  //Velocity(el.parentNode, "fadeIn", {duration:2000, delay:500})
  //Velocity(innerEl, "transition.slideUpIn", {duration: 1500})
}

export default (el, opts={}) => {
  const settings = merge({
    readyClass:'video-ready',
    parentEl:el.parentNode,
    autoload:true,
    fadeIn:fadeIn
  })(opts)

  let revealed = false
  let ready    = false
  let paused   = true

  let play = () => {
    if (ready && paused){
      paused = false
      el.play()
    } 
  }

  let pause = () => {
    if (!paused){
      paused = true
      el.pause()
    }
  }

  let setReady = (value) => {
    if (!value) return
    if ( inViewport(el) ) play(el)
    if (!revealed){
      revealed = true
      settings.fadeIn(el)
    }
    ready = value
  }

  //Add src immediately
  if (settings.autoload) setSrc(el)

  scroll( (y, prevY) => {
    if ( inViewport(el) ){
      if ( !el.getAttribute('src') ){
        setSrc(el)
      }
      play(el)
    } else {
      pause(el)
    }
  })

  ;['canplaythrough','canplay'].forEach( event => {
    el.addEventListener(event, () => {
      setReady( testState(el) )
    })
  })

  setReady( testState(el) )
}
