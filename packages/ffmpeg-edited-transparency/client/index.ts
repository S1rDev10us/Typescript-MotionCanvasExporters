import {makePlugin} from '@motion-canvas/core/lib/plugin';
import type {ExporterClass} from '@motion-canvas/core/lib/app';
import {FFmpegExporterClient} from './FFmpegExporterClient';

export default makePlugin({
  name: 'ffmpeg-edited-transparency-plugin',
  exporters(): ExporterClass[] {
    return [FFmpegExporterClient];
  },
});
