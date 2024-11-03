import { Direction, eDirection } from '../../Direction';
import { ICommand } from '../Command';
import { IContext } from '../Context/Context';
import { ICellObject } from '../Context/Internal/CellObject';

export class CmdMovePacMan implements ICommand
{
    _direction: eDirection;

    // ==========================

    public constructor(direction: eDirection)
    {
        this._direction = direction;
    }

    // ======= ICommand =========

    public Exec(context: IContext): void
    {
        let pacMan: ICellObject = context.PacMan;
        const isCanMove: boolean = context.Field.IsCanMove(pacMan.X, pacMan.Y, this._direction);

        let rotateValue: number = 0;
        switch (this._direction)
        {
            case eDirection.UP:
                rotateValue = 4.7;
                break;
            case eDirection.DOWN:
                rotateValue = 7.9;
                break;
            case eDirection.LEFT:
                rotateValue = 3.1;
                break;
            default:
                rotateValue = 0;
                break;
        }
        pacMan.SetRotate(rotateValue);
        context.EventManager.RotatePacMan(rotateValue);

        if (isCanMove)
        {
            const nextPosition = Direction.GetNextPosition(pacMan.X, pacMan.Y, this._direction);

            pacMan.UpdatePosition(nextPosition.x, nextPosition.y);
            context.EventManager.UpdatePacManPosition(nextPosition.x, nextPosition.y);
        }
    }
}