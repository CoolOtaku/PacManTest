import { IEventManagerWritable } from "../EventManager";
import { Field, IField } from "./Internal/Field";
import { ICellObject, CellObject } from "./Internal/CellObject";

export interface IContext
{
    get EventManager(): IEventManagerWritable;

    get Field(): IField;

    CreatePacMan(x: number, y: number): ICellObject;
    get PacMan(): ICellObject;

    CreateGhosts(x1: number, y1: number, x2: number, y2: number): ICellObject[];
    get Ghosts(): ICellObject[];
}

// ##############################

export class Context implements IContext
{
    private readonly _eventManager: IEventManagerWritable;
    private readonly _field: IField;
    private _pacMan!: ICellObject;
    private _ghosts!: ICellObject[];

    // ==========================

    public constructor(eventManager: IEventManagerWritable)
    {
        this._eventManager = eventManager;
        this._field = new Field();
        this._ghosts = [];
    }

    // ===== IContext ==========

    public get EventManager(): IEventManagerWritable
    { return this._eventManager; }

    public get Field(): IField
    { return this._field; }

    public CreatePacMan(x: number, y: number): ICellObject
    {
         this._pacMan = new CellObject(x, y);
         return this._pacMan;
    }

    public get PacMan(): ICellObject
    { return this._pacMan; }

    public CreateGhosts(x1: number, y1: number, x2: number, y2: number): ICellObject[]
    {
        this._ghosts.push(new CellObject(x1, y1));
        this._ghosts.push(new CellObject(x2, y2));

        return this._ghosts;
    }

    public get Ghosts(): ICellObject[]
    { return this._ghosts; }
}