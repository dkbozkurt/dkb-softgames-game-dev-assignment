import { Scene } from './Scene';
import { Text } from '../../engine/Components/Text';
import FireParticleSystem from '../World/PhoenixFlame/FireParticleSystem';

export default class PhoenixFlameScene extends Scene {
    private _fireSystem!: FireParticleSystem;

    constructor() {
        super();
        this.setupUI();
    }

    private setupUI(): void {
        this._fireSystem = new FireParticleSystem();
        this.addChild(this._fireSystem);
    }

    protected onShow(): void {
        this._fireSystem.start();
    }

    protected onHide(): void {
        this._fireSystem.stop();
    }

    public update(): void {
        this._fireSystem.update();
    }

    public destroy(): void {
        this._fireSystem.destroy({ children: true });
        super.destroy({ children: true });
    }
}