import { Point } from "pixi.js";
import { Interpolations, eInterpolation } from "../../Common/Tweener/Interpolation";

export interface IPositionManager
{
    GetPosition(x: number, y: number) : Point;
}

// #################################

export class PositionManager implements IPositionManager
{
    readonly _leftTop: Point;
    readonly _rightBottom: Point
    readonly _fieldWidth: number;
    readonly _fieldHeight: number;

    // ==============================

    public constructor(leftTop: Point, rightBottom: Point, fieldWidth: number, fieldHeight: number)
    {
        this._leftTop = leftTop;
        this._rightBottom = rightBottom;
        this._fieldWidth = fieldWidth;
        this._fieldHeight = fieldHeight;
    }

    // ====== IPositionManager =====

    public GetPosition(x: number, y: number) : Point
    {
        let resultX : number = Interpolations.InterpolateNum(this._leftTop.x, this._rightBottom.x, x / (this._fieldWidth - 1), eInterpolation.INTERPOLATE_TYPE_LINEAR);
        let resultY : number = Interpolations.InterpolateNum(this._leftTop.y, this._rightBottom.y, y / (this._fieldHeight - 1), eInterpolation.INTERPOLATE_TYPE_LINEAR);
        return new Point(resultX, resultY);
    }
}