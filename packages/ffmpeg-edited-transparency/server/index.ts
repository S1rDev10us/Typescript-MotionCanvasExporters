import {
  Plugin,
  PLUGIN_OPTIONS,
  PluginConfig,
} from '@motion-canvas/vite-plugin/lib/plugins';
import {FFmpegBridge} from './FFmpegBridge';
import {PluginOption} from 'vite';

export default (): PluginOption & Plugin => {
  let config: PluginConfig;
  return {
    name: 'motion-canvas/ffmpeg-edited-transparency',
    [PLUGIN_OPTIONS]: {
      entryPoint: '@motion-canvas/ffmpeg-edited-transparency/lib/client',
      async config(value) {
        config = value;
      },
    },
    configureServer(server) {
      new FFmpegBridge(server.ws, config);
    },
  };
};
