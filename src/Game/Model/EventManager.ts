import { Event, IEvent } from "../../Common/Event";

export interface IEventManager
{
    get OnCreatePacMan(): IEvent<[x: number, y: number]>;
    get OnUpdatePacManPosition(): IEvent<[x: number, y: number]>;
    get OnRotatePacMan(): IEvent<[rotate: number]>;

    get OnCreateGhosts(): IEvent<[x1: number, y1: number, x2: number, y2: number]>;
    get OnUpdateGhost1Position(): IEvent<[x: number, y: number]>;
    get OnUpdateGhost2Position(): IEvent<[x: number, y: number]>;
}

export interface IEventManagerWritable
{
    CreatePacMan(x: number, y: number): void;
    UpdatePacManPosition(x: number, y: number): void;
    RotatePacMan(rotate: number): void;

    CreateGhosts(x1: number, y1: number, x2: number, y2: number): void;
    UpdateGhost1Position(x: number, y: number): void;
    UpdateGhost2Position(x: number, y: number): void;
}

// #######################################

export class EventManager implements IEventManager, IEventManagerWritable
{
    private _onCreatePacMan = new Event<[x: number, y: number]>();
    private _onUpdatePacManPosition = new Event<[x: number, y: number]>();
    private _onRotatePacMan = new Event<[rotate: number]>();

    private _onCreateGhosts = new Event<[x1: number, y1: number, x2: number, y2: number]>();
    private _onUpdateGhost1Position = new Event<[x: number, y: number]>();
    private _onUpdateGhost2Position = new Event<[x: number, y: number]>();

    // ========= IEventManager ===========

    public get OnCreatePacMan(): IEvent<[x: number, y: number]>
    { return this._onCreatePacMan; }

    public get OnUpdatePacManPosition(): IEvent<[x: number, y: number]>
    { return this._onUpdatePacManPosition; }

    public get OnRotatePacMan(): IEvent<[rotate: number]>
    { return this._onRotatePacMan; }

    public get OnCreateGhosts(): IEvent<[x1: number, y1: number, x2: number, y2: number]>
    { return this._onCreateGhosts; }

    public get OnUpdateGhost1Position(): IEvent<[x: number, y: number]>
    { return this._onUpdateGhost1Position; }

    public get OnUpdateGhost2Position(): IEvent<[x: number, y: number]>
    { return this._onUpdateGhost2Position; }

    // ======== IEventManagerWritable =====

    public CreatePacMan(x: number, y: number): void
    { this._onCreatePacMan.Invoke(x, y); }

    public UpdatePacManPosition(x: number, y: number): void
    { this._onUpdatePacManPosition.Invoke(x, y); }

    public RotatePacMan(rotate: number): void
    { this._onRotatePacMan.Invoke(rotate); }

    public CreateGhosts(x1: number, y1: number, x2: number, y2: number): void
    { this._onCreateGhosts.Invoke(x1, y1, x2, y2); }

    public UpdateGhost1Position(x: number, y: number): void
    { this._onUpdateGhost1Position.Invoke(x, y); }

    public UpdateGhost2Position(x: number, y: number): void
    { this._onUpdateGhost2Position.Invoke(x, y); }
}