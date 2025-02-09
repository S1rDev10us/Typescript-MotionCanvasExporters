# DISCLAIMER: I DO NOT OWN [MOTION CANVAS](https://github.com/motion-canvas) THIS IS A USER MADE TOOL FOR MOTION CANVAS




<br/>
<p align="center">
  <a href="https://motion-canvas.github.io">
    <img width="180" src="https://motion-canvas.github.io/img/logo_dark.svg" alt="Vite logo">
  </a>
</p>
<p align="center">
  <a href="https://lerna.js.org"><img src="https://img.shields.io/badge/published%20with-lerna-c084fc?style=flat" alt="published with lerna"></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/powered%20by-vite-646cff?style=flat" alt="powered by lerna"></a>
  <a href="https://www.npmjs.com/package/@motion-canvas/core"><img src="https://img.shields.io/npm/v/@motion-canvas/core?style=flat" alt="npm package version"></a>
  <a href="https://chat.motioncanvas.io"><img src="https://img.shields.io/discord/1071029581009657896?style=flat&logo=discord&logoColor=fff&color=404eed" alt="discord"></a>
</p>
<br/>

# Motion Canvas Exporters

An unofficial edit of the exporters for [Motion Canvas](https://motion-canvas.io) so it supports transparency.

## Installation

1. Download the repo
1. Download the dependencies 
   ```sh
   npm run install
   ```
1. Build it with 
   ```sh
   npm run ffmpeg:build
   ```
1. In an existing Motion Canvas project, install the exporter package:
   ```sh
   npm install --save ../path/to/build/folder
   ```
1. Add the exporter as a plugin in your `vite.config.ts`:

   ```diff
     import {defineConfig} from 'vite';
     import motionCanvas from '@motion-canvas/vite-plugin';
   + import ffmpeg-transparency from '@motion-canvas/ffmpeg-edited-transparency';

     export default defineConfig({
       plugins: [
         motionCanvas(),
   +     ffmpeg-transparency(),
       ],
     });
   ```

5. Pick the exporter in the Video Settings tab: (pick the video with transparency option)
   ![Video Settings](./images/video-settings-tab.png)
