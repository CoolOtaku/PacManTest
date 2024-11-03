import { ICommand } from '../Command';
import { IContext } from '../Context/Context';

export class CmdCreateGhosts implements ICommand
{
    _x1: number;
    _y1: number;
    _x2: number;
    _y2: number;

    // ==========================

    public constructor(x1: number, y1: number, x2: number, y2: number)
    {
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
    }

    // ======= ICommand =========

    public Exec(context: IContext): void
    {
        context.CreateGhosts(this._x1, this._y1, this._x2, this._y2);
        context.EventManager.CreateGhosts(this._x1, this._y1, this._x2, this._y2);
    }
}