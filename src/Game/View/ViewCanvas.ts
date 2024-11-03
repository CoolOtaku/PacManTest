import { Container, Sprite, Texture } from "pixi.js";

export interface IViewCanvas
{
    Resize(width: number, height: number) : void;
}

// #####################################

export class ViewCanvas extends Container implements IViewCanvas
{   
    private readonly _backSprite : Sprite;

    // =================================

    public constructor(backTexture: Texture, appWidth: number, appHeight: number)
    {
        super();

        this._backSprite = new Sprite(backTexture);
        this._backSprite.position.set(0);
        this._backSprite.anchor.set(0.5);
        this.addChild(this._backSprite);

        this.Resize(appWidth, appHeight);
    }

    // ======== IVisualManager =========

    public Resize(appWidth: number, appHeight: number) : void
    {
        this.position.set(appWidth / 2, appHeight / 2);

        const scaleFactor = Math.min(
            appWidth / this._backSprite.texture.width, 
            appHeight / this._backSprite.texture.height
        );
        this.scale.set(scaleFactor);
    }
}