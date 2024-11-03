import { compressJpg, compressPng } from '@assetpack/plugin-compress';
import { audio } from '@assetpack/plugin-ffmpeg';
import { json } from '@assetpack/plugin-json';
import { pixiManifest } from '@assetpack/plugin-manifest';
import { pixiTexturePacker } from '@assetpack/plugin-texture-packer';
import { webfont } from '@assetpack/plugin-webfont';
import { ffmpeg } from "@assetpack/plugin-ffmpeg";

export default {
    entry: './raw-assets_test',
    output: './public_test/assets/',
    cache: false,
    plugins: {
        webfont: webfont(),
        //compressJpg: compressJpg(),
        //compressPng: compressPng(),
		//audio: audio(),
        ffmpeg: ffmpeg({
            inputs: ['.mp3', '.ogg', '.wav'],
            outputs: [
                {
                    formats: ['.mp3'],
                    recompress: true,
                    options: {
                        audioBitrate: 96,
                        audioChannels: 1,
                        audioFrequency: 48000,
                    }
                },
            ]
        }),
        json: json(),
        texture: pixiTexturePacker({
            resolutionOptions:{
                maximumTextureSize: 2048,
                resolutions: { default: 1 },
            },
            texturePacker: {
                width: 2048,
                height: 2048,
                powerOfTwo: true,
                removeFileExtension: true,
            },
        }),
        manifest: pixiManifest({
            output: './public_test/assets/assets-manifest.json',
        }),
    },
};

