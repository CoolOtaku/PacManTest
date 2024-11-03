import { ICommand } from '../Command';
import { IContext } from '../Context/Context';

export class CmdCreatePacMan implements ICommand
{
    _x: number;
    _y: number;

    // ==========================

    public constructor(x: number, y: number)
    {
        this._x = x;
        this._y = y;
    }

    // ======= ICommand =========

    public Exec(context: IContext): void
    {
        context.CreatePacMan(this._x, this._y);
        context.EventManager.CreatePacMan(this._x, this._y);
    }
}