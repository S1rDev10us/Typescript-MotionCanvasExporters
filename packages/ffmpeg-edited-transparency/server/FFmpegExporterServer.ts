import { ImageStream } from './ImageStream';
import type { PluginConfig } from '@motion-canvas/vite-plugin/lib/plugins';
import type {
	RendererSettings,
	RendererResult,
} from '@motion-canvas/core/lib/app';
import * as ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import * as fs from 'fs';
import * as path from 'path';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const fileEncodings= <const>["webm", "mov", "mp4"] ;
const pixelFormats= <const>["rgba", "yuv420p", "yuva420p", "yuv411p"];

export interface FFmpegExporterSettings extends RendererSettings {
	audio?: string;
	audioOffset?: number;
	fastStart: boolean;
	includeAudio: boolean;
	fileType: typeof fileEncodings[number];
	pixelFormat: typeof pixelFormats[number];
}

/**
 * The server-side implementation of the FFmpeg video exporter.
 */
export class FFmpegExporterServer {
	private readonly stream: ImageStream;
	private readonly command: ffmpeg.FfmpegCommand;
	private readonly promise: Promise<void>;

	public constructor(
		settings: FFmpegExporterSettings,
		private readonly config: PluginConfig,
	) {
		this.stream = new ImageStream();
		this.command = ffmpeg();

		// Input image sequence
		this.command
			.input(this.stream)
			.inputFormat('image2pipe')
			.inputFps(settings.fps);

		// Input audio file
		if (settings.includeAudio && settings.audio) {
			this.command
				.input((settings.audio as string).slice(1))
				// FIXME Offset only works for negative values.
				.inputOptions([`-itsoffset ${settings.audioOffset ?? 0}`]);
		}

		// Output settings
		const size = {
			x: Math.round(settings.size.x * settings.resolutionScale),
			y: Math.round(settings.size.y * settings.resolutionScale),
		};
		this.command
			.output(path.join(this.config.output, `${settings.name}.${fileEncodings.find((v)=>v==settings.fileType)??fileEncodings[0]}`))
			.outputOptions([`-pix_fmt ${pixelFormats.find((v)=>v==settings.pixelFormat)??pixelFormats[0]}`, '-shortest'])
			.outputFps(settings.fps)
			.size(`${size.x}x${size.y}`);
		if (settings.fastStart) {
			this.command.outputOptions(['-movflags +faststart']);
		}

		this.promise = new Promise<void>((resolve, reject) => {
			this.command.on('end', resolve).on('error', reject);
		});
	}

	public async start() {
		if (!fs.existsSync(this.config.output)) {
			await fs.promises.mkdir(this.config.output, { recursive: true });
		}
		this.command.run();
	}

	public async handleFrame({ data }: { data: string }) {
		const base64Data = data.slice(data.indexOf(',') + 1);
		this.stream.pushImage(Buffer.from(base64Data, 'base64'));
	}

	public async end(result: RendererResult) {
		this.stream.pushImage(null);
		if (result === 1) {
			try {
				this.command.kill('SIGKILL');
				await this.promise;
			} catch (_) {
				// do nothing
			}
		} else {
			await this.promise;
		}
	}
}
