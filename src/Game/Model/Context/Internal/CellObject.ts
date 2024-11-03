export interface ICellObject
{
    get X(): number;
    get Y(): number;
    get Rotate(): number;

    UpdatePosition(x: number, y: number): void;
    SetRotate(rotate: number): void;
}

// ##############################

export class CellObject implements ICellObject
{
    _x: number;
    _y: number;
    _rotate: number;

    // =========================

    public constructor(x: number, y: number)
    {
        this._x = x;
        this._y = y;
        this._rotate = 0;
    }

    // ===== ICellObject ===========

    public get X(): number
    { return this._x; }

    public get Y(): number
    { return this._y; }

    public get Rotate(): number
    { return this._rotate; }

    public UpdatePosition(x: number, y: number): void {
        this._x = x;
        this._y = y;
    }

    public SetRotate(rotate: number): void
    { this._rotate = rotate; }
}