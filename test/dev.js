import video from './../src/main.js'

document.addEventListener('DOMContentLoaded', e => {
  const videoEl = document.querySelector('video')
  const module = video(videoEl)
  module.on('pause', () => console.dir('pause'))
  module.on('play', () => console.dir('play'))
})
