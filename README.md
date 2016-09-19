A small module that automates the play and pause of videos based on scroll position of the user. If you need to simply play a video when it is in view of the user and pause it when not, this module is your guy!

**Dependencies**
This example uses the [RAFScroll](https://gist.github.com/maxrolon/bc6b818b193d6813345e569667b47e83) library to replace ```window.addEventListener('scroll', function(e) {..``` native usage. Replace if you want a simple but less performant option. We also use the [Velocity](http://velocityjs.org/) animation library to fade in the video. Again, replace this with another form of animation if you need!

**Settings**
1. readyClass (string)- Class attached to the parentEl when the video is ready to be played
2. parentEl (Node reference) - The parent of the video to add the readyClass to
3. autoload (boolean) - Do we want load the video immediately (on instantiation) or when the user scrolls to the video?
4. fadeIn (function) - The function to call when the video is ready to be played

**Usage**
*InitScripts.js instantiation (no options supplied)*
```
  <div class="video-wrap">
    <video data-src="{{ 'hero-video.mp4' | asset_url }}" width="100%" height="100%" class="hero__video" loop muted data-module="video"></video>
  </div>
```

*Vanilla JS instantiation*
```
import Video form '<./.../src>'

new Video( document.getElementById('Video'), {fadeIn:<function>} );
