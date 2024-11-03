export enum eDirection
{
    LEFT,
    RIGHT,
    UP,
    DOWN
}

export class Direction
{
    public static GetNextPosition(x: number, y: number, direction: eDirection): { x: number, y: number }
    {
        switch (direction)
        {
            case eDirection.LEFT:
                return { x: x - 1, y: y };
            case eDirection.RIGHT:
                return { x: x + 1, y: y };
            case eDirection.UP:
                return { x: x, y: y - 1 };
            case eDirection.DOWN:
                return { x: x, y: y + 1 };
            default:
                throw new Error("Direction.GetNextPosition: Invalid direction");
        }
    }
}