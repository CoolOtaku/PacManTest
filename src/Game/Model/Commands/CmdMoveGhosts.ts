import { Direction, eDirection } from '../../Direction';
import { ICommand } from '../Command';
import { IContext } from '../Context/Context';
import { ICellObject } from '../Context/Internal/CellObject';
import { IField } from '../Context/Internal/Field';

export interface ICell
{
    x: number;
    y: number;
    path: { x: number, y: number }[];
}

// ==========================

export class CmdMoveGhosts implements ICommand
{
    private _directions: Map<ICellObject, eDirection> = new Map();

    // ======= ICommand =========

    public Exec(context: IContext): void
    {
        const ghosts: ICellObject[] = context.Ghosts;
        const pacMan: ICellObject = context.PacMan;

        for (let i = 0; i < ghosts.length; ++i)
        {
            const ghost = ghosts[i];

            if (!this._directions.has(ghost))
            {
                if (i === 0)
                {
                    this._directions.set(ghost, this.getRandomDirection());
                }
            }

            let direction: eDirection;

            if (i === 0)
            {
                direction = this._directions.get(ghost)!;
                const isCanMove: boolean = context.Field.IsCanMove(ghost.X, ghost.Y, direction);

                if (isCanMove)
                {
                    const nextPosition = Direction.GetNextPosition(ghost.X, ghost.Y, direction);
                    ghost.UpdatePosition(nextPosition.x, nextPosition.y);
                    context.EventManager.UpdateGhost1Position(nextPosition.x, nextPosition.y);
                }
                else
                {
                    direction = this.getRandomDirection();
                    this._directions.set(ghost, direction);
                }
            }
            else if (i === 1)
            {
                direction = this.getDirectionTowardsPacMan(ghost, pacMan);
                const isCanMove: boolean = context.Field.IsCanMove(ghost.X, ghost.Y, direction);

                if (isCanMove)
                {
                    const nextPosition = Direction.GetNextPosition(ghost.X, ghost.Y, direction);
                    ghost.UpdatePosition(nextPosition.x, nextPosition.y);
                    context.EventManager.UpdateGhost2Position(nextPosition.x, nextPosition.y);
                }
                else
                {
                    const path = this.FindShortestPath(context.Field, ghost.X, ghost.Y, pacMan.X, pacMan.Y);

                    if (path)
                    {
                        const nextMove = path[0];
                        ghost.UpdatePosition(nextMove.x, nextMove.y);
                        context.EventManager.UpdateGhost2Position(nextMove.x, nextMove.y);
                    }
                }
            }
        }
    }

    // ==========================

    private getRandomDirection(): eDirection
    {
        const directions = [eDirection.UP, eDirection.DOWN, eDirection.LEFT, eDirection.RIGHT];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    // ==========================

    private getDirectionTowardsPacMan(ghost: ICellObject, pacMan: ICellObject): eDirection
    {
        const deltaX = pacMan.X - ghost.X;
        const deltaY = pacMan.Y - ghost.Y;

        if (Math.abs(deltaX) > Math.abs(deltaY))
        {
            return deltaX > 0 ? eDirection.RIGHT : eDirection.LEFT;
        }
        else
        {
            return deltaY > 0 ? eDirection.DOWN : eDirection.UP;
        }
    }

    // ==========================

    private FindShortestPath(field: IField, startX: number, startY: number, endX: number, endY: number): { x: number, y: number }[] | null
    {
        const directions = [eDirection.LEFT, eDirection.RIGHT, eDirection.UP, eDirection.DOWN];
        const visited: boolean[][] = Array.from({ length: field.Height }, () => Array(field.Width).fill(false));

        const queue: ICell[] = [{ x: startX, y: startY, path: [] }];

        visited[startY][startX] = true;

        while (queue.length > 0)
        {
            const current = queue.shift() as ICell;

            if (current.x === endX && current.y === endY)
            {
                return current.path;
            }
            for (let direction of directions)
            {
                const nextPosition = Direction.GetNextPosition(current.x, current.y, direction);

                if (field.IsCanMove(current.x, current.y, direction) && !visited[nextPosition.y][nextPosition.x])
                {
                    visited[nextPosition.y][nextPosition.x] = true;
                    queue.push({
                        x: nextPosition.x,
                        y: nextPosition.y,
                        path: [...current.path, { x: nextPosition.x, y: nextPosition.y }],
                    });
                }
            }
        }

        return null;
    }
}