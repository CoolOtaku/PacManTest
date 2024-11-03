import { Point, Sprite, Texture } from 'pixi.js';
import { ITweener, ITweenerManager } from '../../../Common/Tweener/Tweener';
import { Action } from '../../../Common/Action';
import { eInterpolation, Interpolations } from '../../../Common/Tweener/Interpolation';

export interface IGhost
{
    UpdatePosition(position: Point, time: number) : void;
}

// ##################################

export abstract class Ghost extends Sprite
{
    readonly _texture: Texture;
    readonly _spriteAnimTweener: ITweener;
    readonly _positionTweener: ITweener;

    public constructor(tweenManager: ITweenerManager, textureName: string)
    {
        super();

        this.scale.set(0.5);
        this.anchor.set(0.5);

        this._spriteAnimTweener = tweenManager.Create();
        this._positionTweener = tweenManager.Create();

        this._texture = Texture.from(textureName);

        this.UpdateSprite();
    }

    // =========================

    private async UpdateSprite(): Promise<void>
    {
        while (true)
        {
            await this._spriteAnimTweener.Timer(0.3);
        }
    }

    // ========= Common methods ============

    public UpdatePosition(position: Point, time: number): void
    {
        if (time <= 0.0001)
        {
            this.position.set(position.x, position.y);
        }
        else
        {
            const startX: number = this.position.x;
            const startY: number = this.position.y;
            const endX: number = position.x;
            const endY: number = position.y;

            this._positionTweener.InterpolateNum(0.0, 1.0, time, new Action((delta: number) =>
                {
                    this.position.set(Interpolations.InterpolateNum(startX, endX, delta, eInterpolation.INTERPOLATE_TYPE_LINEAR),
                        Interpolations.InterpolateNum(startY, endY, delta, eInterpolation.INTERPOLATE_TYPE_LINEAR));
                },
                this));
        }
    }
}