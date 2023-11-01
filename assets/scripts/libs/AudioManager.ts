import { assert, assetManager, AudioClip, AudioSource, log, resources } from "cc";
import global from "../global";
import pubsub from "./pubsub";

export class AudioManager {
    private static _musicSource?: AudioSource;
    private static _effectSource?: AudioSource;
    private static _cachedAudioClipMap: Record<string, AudioClip> = {};

    // init AudioManager in GameRoot component.
    public static init (musicSource: AudioSource, effectSource: AudioSource) {
        log('Init AudioManager !');
        AudioManager._musicSource = musicSource;
        AudioManager._effectSource = effectSource;

        pubsub.sub("setting_changed", () => {
            this._musicSource.volume = global.setting.volume.music;
        })
    }

    public static playMusic () {
        const audioSource = AudioManager._musicSource!;
        audioSource.play();
    }

    public static playSound(name: string) {
        let volume = global.setting.volume.effect;
        if (volume < 0.1) {
            return;
        }
        const audioSource = AudioManager._effectSource!;

        const path = `sounds/${name}`;
        let cachedAudioClip = AudioManager._cachedAudioClipMap[path];
        if (cachedAudioClip) {
            audioSource.playOneShot(cachedAudioClip, volume);
        } else {
            resources.load(path, AudioClip, (err, clip) => {
                if (err) {
                    console.warn(err);
                    return;
                }
                AudioManager._cachedAudioClipMap[path] = clip;
                audioSource.playOneShot(clip, 1);
            });
        }
    }
}