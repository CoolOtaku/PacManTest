import { Container } from 'pixi.js';
import { IPositionManager } from "./PositionManager";
import { IEventManager } from "../Model/EventManager";
import { IObjectsFactory } from "./ObjectsFactory";
import { IPacMan } from "./Objects/PacMan";
import { IGhost } from './Objects/Ghost';

export interface IViewModelHandler
{}

export class ViewModelHanlder implements IViewModelHandler
{
    private readonly _viewCanvas: Container;
    private readonly _positionManager: IPositionManager;
    private readonly _objectsFactory: IObjectsFactory;
    private readonly _modelEventManager: IEventManager;
    private readonly _iterationTime: number;

    private _pacMan!: IPacMan;
    private _ghosts!: IGhost[];

    // ======================================

    public constructor(viewCanvas: Container, positionManager: IPositionManager, objectsFactory: IObjectsFactory, modelEventManager: IEventManager, iterationTime: number)
    {
        this._viewCanvas = viewCanvas;
        this._positionManager = positionManager;
        this._objectsFactory = objectsFactory;
        this._modelEventManager = modelEventManager;
        this._iterationTime = iterationTime;

        this._modelEventManager.OnCreatePacMan.Add(this.OnCreatePacMan, this);
        this._modelEventManager.OnUpdatePacManPosition.Add(this.OnUpdatePacManPosition, this);
        this._modelEventManager.OnRotatePacMan.Add(this.OnRotatePacMan, this)

        this._modelEventManager.OnCreateGhosts.Add(this.OnCreateGhosts, this);
        this._modelEventManager.OnUpdateGhost1Position.Add(this.OnUpdateGhost1Position, this);
        this._modelEventManager.OnUpdateGhost2Position.Add(this.OnUpdateGhost2Position, this);
    }

    // ======================================

    private OnCreatePacMan(fieldX: number, fieldY: number): void
    {
        this._pacMan = this._objectsFactory.CreatePacMan();
        this._pacMan.UpdatePosition(this._positionManager.GetPosition(fieldX, fieldY), 0.0);
    }

    private OnUpdatePacManPosition(fieldX: number, fieldY: number): void
    {
        this._pacMan.UpdatePosition(this._positionManager.GetPosition(fieldX, fieldY), this._iterationTime);
    }

    private OnRotatePacMan(fieldRotate: number): void
    {
        this._pacMan.SetRotate(fieldRotate);
    }

    private OnCreateGhosts(x1: number, y1: number, x2: number, y2: number): void {
        this._ghosts = this._objectsFactory.CreateGhosts();

        this._ghosts[0].UpdatePosition(this._positionManager.GetPosition(x1, y1), 0.0);
        this._ghosts[1].UpdatePosition(this._positionManager.GetPosition(x2, y2), 0.0);
    }

    private OnUpdateGhost1Position(fieldX: number, fieldY: number): void {
        this._ghosts[0].UpdatePosition(this._positionManager.GetPosition(fieldX, fieldY), this._iterationTime);
    }

    private OnUpdateGhost2Position(fieldX: number, fieldY: number): void {
        this._ghosts[1].UpdatePosition(this._positionManager.GetPosition(fieldX, fieldY), this._iterationTime);
    }
}