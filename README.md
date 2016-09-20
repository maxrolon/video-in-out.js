A small module that automates the play and pause of videos based on scroll position of the user. If you need to simply play a video when it is in view of the user and pause it when not, this module is your guy!

## Install 
```bash
npm i video-in-out.js --save
```

## Usage
#### Create An Instance

```javascript
import Video from 'video-in-out'

document.addEventListener('DOMContentLoaded', e => {
  const videoEl = document.querySelector('video')
  
  const module = Video(videoEl,{
    readyClass:'is-ready', //default
    parentEl: el.parentNode, //default
    autoload: true, //default (load the video source immediately)
    fadeIn: el => {
      el.classList.add('reveal')
    } 
  })
  
  //If the video is loaded from cache and ready
  //immediately, this will not fire. Use the getState method to check
  module.on('ready', () => console.log('ready'))
  
  //Fired every time the video is paused
  module.on('pause', () => console.log('pause'))
  
  //Fired every time the video is played
  module.on('play', () => console.log('play'))
  
  //Is the video ready to be played?
  module.getReady() //true || false 
})
```

##Dependencies

- [RAFScroll](https://github.com/maxrolon/raf-scroll.js) replaces ```window.addEventListener('scroll', function(e) {..``` native usage with a event omitter that is optimized with Request Animation Frames
- [loop.js](https://github.com/estrattonbailey/loop.js) provides an event emission API

##Settings

1. readyClass (string)- Class attached to the parentEl when the video is ready to be played

2. parentEl (Node reference) - The parent of the video to add the readyClass to

3. autoload (boolean) - Do we want load the video immediately (on instantiation) or when the user scrolls to the video?

4. fadeIn (function) - The function to call when the video is ready to be played
