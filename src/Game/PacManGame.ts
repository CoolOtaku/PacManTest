import { Graphics, Point, TextStyle, Text, Texture } from 'pixi.js';
import { GameBase } from "../Base/GameBase";
import { ITweener, ITweenerManager, TweenerManager } from "../Common/Tweener/Tweener";
import { ViewCanvas } from "./View/ViewCanvas";
import { IPositionManager, PositionManager } from "./View/PositionManager";
import { IObjectsFactory, ObjectsFactory } from "./View/ObjectsFactory";
import { IViewModelHandler, ViewModelHanlder } from "./View/ViewModelHandler";
import { IModel, Model } from "./Model/Model";
import { eDirection } from "./Direction";

export class PacManGame extends GameBase
{
    private readonly ITERATION_TIME: number = 0.5;
    public static IS_RUN_GAME: boolean;

    private _tweenManager : ITweenerManager = new TweenerManager();
    private _viewCanvas!: ViewCanvas;
    private _positionManager!: IPositionManager;
    private _objectsFactory!: IObjectsFactory;
    private _viewModelHandler!: IViewModelHandler;
    private _model!: IModel;

    private _gameLoopTweener: ITweener = this._tweenManager.Create();
    private _localDirection = eDirection.RIGHT;

    private _gameOverText!: Text;
    private _restartButton!: Graphics;

    // ======================================

    protected OnResourcesLoaded(): void
    {
        this._model = new Model();

        const backTexture : Texture = Texture.from("Background");

        this._viewCanvas = new ViewCanvas(backTexture, this.Width, this.Height);
        this._app.stage.addChild(this._viewCanvas);

        this._positionManager = this.CreatePositionManager(backTexture.width, backTexture.height);
        this._objectsFactory = new ObjectsFactory(this._viewCanvas, this._tweenManager);
        this._viewModelHandler = new ViewModelHanlder(this._viewCanvas, this._positionManager, this._objectsFactory, this._model.EventManager, this.ITERATION_TIME);

        this.SetupGameOverUI();

        window.addEventListener('keydown', this.OnKeyDown.bind(this));

        this.GameLoop();
    }

    protected OnUpdate(deltaTime: number): void
    {
        this._tweenManager.Update(deltaTime);
    }

    protected OnResize(width: number, height: number): void
    {
        this._viewCanvas.Resize(width, height);
    }

    // =====================================

    private OnKeyDown(event: KeyboardEvent): void
    {
        switch (event.key)
        {
            case 'ArrowUp':
                this._localDirection = eDirection.UP;
                break;
            case 'ArrowDown':
                this._localDirection = eDirection.DOWN;
                break;
            case 'ArrowLeft':
                this._localDirection = eDirection.LEFT;
                break;
            case 'ArrowRight':
                this._localDirection = eDirection.RIGHT;
                break;
            default:
                return;
        }
    }

    // =====================================

    private async GameLoop(): Promise<void>
    {
        this._model.Init();
        PacManGame.IS_RUN_GAME = true;

        while (PacManGame.IS_RUN_GAME)
        {
            this._model.Update(this._localDirection);
            await this._gameLoopTweener.Timer(this.ITERATION_TIME);
        }

        this.ShowGameOverUI();
    }

    // =====================================

    private CreatePositionManager(width: number, height: number) : IPositionManager
    {
        const fieldWidth : number = 16;
        const fieldHeight : number = 12;
        const halfWidth : number = width / 2;
        const halfHeight : number = height / 2;
        const halfCellSizeX : number = width / fieldWidth / 2;
        const halfCellSizeY : number = height / fieldHeight / 2;
        return new PositionManager(new Point(-halfWidth + halfCellSizeX, -halfHeight + halfCellSizeY),
            new Point(halfWidth - halfCellSizeX, halfHeight - halfCellSizeY), fieldWidth, fieldHeight);
    }

    // =====================================

    private SetupGameOverUI(): void
    {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 50,
            fill: '#ff0000',
            align: 'center',
        });

        this._gameOverText = new Text("Game Over", style);
        this._gameOverText.anchor.set(0.5);
        this._gameOverText.x = this.Width / 2;
        this._gameOverText.y = this.Height / 2 - 50;
        this._gameOverText.visible = false;
        this._app.stage.addChild(this._gameOverText);

        this._restartButton = new Graphics();
        this._restartButton.beginFill(0x00ff00);
        this._restartButton.drawRoundedRect(0, 0, 200, 50, 10);
        this._restartButton.endFill();
        this._restartButton.x = this.Width / 2 - 100;
        this._restartButton.y = this.Height / 2 + 50;
        this._restartButton.interactive = true;
        this._restartButton.visible = false;

        const buttonText = new Text("Restart", new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#ffffff',
        }));
        buttonText.anchor.set(0.5);
        buttonText.x = 100;
        buttonText.y = 25;
        this._restartButton.addChild(buttonText);

        this._restartButton.on('pointerdown', () =>
        {
            this.RestartGame();
        }
        );

        this._app.stage.addChild(this._restartButton);
    }

    private ShowGameOverUI(): void
    {
        this._gameOverText.visible = true;
        this._restartButton.visible = true;
    }

    private HideGameOverUI(): void
    {
        this._gameOverText.visible = false;
        this._restartButton.visible = false;
    }

    private RestartGame(): void
    {
        this.HideGameOverUI();
        PacManGame.IS_RUN_GAME = true;
        location.reload();
    }
}