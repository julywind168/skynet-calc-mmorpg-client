import { _decorator, Component, AudioSource, assert, director } from 'cc';
const { ccclass, property } = _decorator;


import { AudioManager } from '../libs/AudioManager';

@ccclass('Manager')
export class Manager extends Component {
    @property(AudioSource)
    private musicSource: AudioSource = null!;

    @property(AudioSource)
    private effectSource: AudioSource = null!;

    onLoad () {

        director.addPersistRootNode(this.node);

        // init AudioManager
        AudioManager.init(this.musicSource, this.effectSource);
    }
}

