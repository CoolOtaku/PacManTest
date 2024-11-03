import { Action } from "../Action";
import { Interpolations, eInterpolation } from "./Interpolation";
import { PromiseController } from "../PromiseController";

export interface ITweener
{
    InterpolateNum(startValue : number, endValue : number, time : number, onProgress : Action<[number]>|null, onComplete? : Action<[]>|null, interpolation? : eInterpolation) : Promise<void>;
    Timer(time : number, clbk? : Action<[]>|null) : Promise<void>;

    Skip() : void;
    ForcedComplete() : void;
    SetTimeScale(timeScale : number) : void;
    get TimeScale() : number;
    get IsBuzy() : boolean;

    Dispose() : void;
    get IsDisposed() : boolean;
}

export interface ITweenerManager
{
    Create() : ITweener;

    InterpolateNum(startValue : number, endValue : number, time : number, onProgress : Action<[number]>|null, onComplete? : Action<[]>|null, interpolation? : eInterpolation) : Promise<void>;
    Timer(time : number, clbk? : Action<[]>|null) : Promise<void>;
    
    Update(deltaTime : number) : void;
    DisposeAllTweeners() : void;
}

// ##############################################

export class TweenerManager implements ITweenerManager
{
    _tweeners : Tweener[] = [];

    // ========== ITweenerManager ==============

    public Create() : ITweener
    {
        let result : Tweener = new Tweener();
        this._tweeners.push(result);
        return result;
    }

    public InterpolateNum(startValue : number, endValue : number, time : number, onProgress : Action<[number]>|null, onComplete? : Action<[]>|null, interpolation? : eInterpolation) : Promise<void>
    {
        let result : Tweener = new Tweener(true);
        this._tweeners.push(result);
        return result.InterpolateNum(startValue, endValue, time, onProgress, onComplete, interpolation);
    }

    public Timer(time : number, clbk? : Action<[]>|null) : Promise<void>
    {
        let result : Tweener = new Tweener(true);
        this._tweeners.push(result);
        return result.Timer(time, clbk);
    }

    public Update(deltaTime : number) : void
    {
        for (let i : number = 0; i < this._tweeners.length;)
        {
            let curTweener : Tweener = this._tweeners[i];

            if (curTweener.IsDisposed)
            {
                this._tweeners.splice(i, 1);
            }
            else
            {
                if (curTweener.IsBuzy)
                    curTweener.Update(deltaTime);

                i++;
            }
        }
    }

    public DisposeAllTweeners() : void
    {
        for (let curTweener of this._tweeners)
            curTweener.Dispose();

        this._tweeners = [];
    }
}

// ##############################################

class Tweener implements ITweener
{
    _isDisposeAfterComplete : boolean;
    _isDisposed : boolean = false;
    _timeScale : number = 1.0;

    _internalTweener : IInternalTweener | null = null;
    _promiseController : PromiseController<void> | null = null;
    _toTime : number = 0.0;
    _currentTime : number = 0.0;
    _completeClbk : Action<[]>|null = null;

    // ==========================================

    public constructor(isDisposeAfterComplete : boolean = false)
    { this._isDisposeAfterComplete = isDisposeAfterComplete; }

    // ==========================================

    public Update(deltaTime : number) : void
    {
        if (this._isDisposed)
            return;

        if (this._internalTweener == null)
            return;

        this._currentTime += deltaTime * this._timeScale;

        if (this._currentTime < this._toTime)
        {
            let delta : number = this._currentTime / this._toTime;
            this._internalTweener.Tween(delta);
        }
        else
        {
            this.ForcedComplete();
        }
    }

    // ============== ITweener ==================

    public InterpolateNum(startValue : number, endValue : number, time : number, onProgress : Action<[number]>|null, onComplete? : Action<[]>|null, interpolation? : eInterpolation) : Promise<void>
    {
        if (this._isDisposed)
        {
            const promiseResult = new PromiseController<void>();
            promiseResult.Resolve();
            return promiseResult.Promise;
        }

        if (onComplete === undefined)
            onComplete = null;

        if (interpolation === undefined)
            interpolation = eInterpolation.INTERPOLATE_TYPE_LINEAR;

        if (this._promiseController !== null)
            this._promiseController.Resolve();

        this._internalTweener = new InternalTweenerNum(startValue, endValue, onProgress, interpolation);
        this._promiseController = new PromiseController();
        this._toTime = time;
        this._currentTime = 0.0;
        this._completeClbk = onComplete;
        return this._promiseController.Promise;
    }

    public Timer(time : number, clbk? : Action<[]>|null) : Promise<void>
    {
        if (this._isDisposed)
        {
            const promiseResult = new PromiseController<void>();
            promiseResult.Resolve();
            return promiseResult.Promise;
        }

        if (clbk === undefined)
            clbk = null;

        if (this._promiseController !== null)
            this._promiseController.Resolve();

        this._internalTweener = new InternalTweenerEmpty();
        this._promiseController = new PromiseController();
        this._toTime = time;
        this._currentTime = 0.0;
        this._completeClbk = clbk;
        return this._promiseController.Promise;
    }

    public Skip() : void
    {
        if (this._isDisposed)
            return;

        if (this._isDisposeAfterComplete)
            this.Dispose();

        if (this._promiseController !== null)
        {
            this._promiseController.Resolve();
            this._promiseController = null;
        }

        this._internalTweener = null;
        this._completeClbk = null;
    }

    public ForcedComplete() : void
    {
        if (this._isDisposed)
            return;

        if (this._internalTweener !== null)
        {
            let internalTweener : IInternalTweener = this._internalTweener;
            let completeClbk : Action<[]>|null = this._completeClbk;
            this.Skip();
            internalTweener.Tween(1.0);
            completeClbk?.Invoke();
        }
    }

    public SetTimeScale(timeScale : number) : void
    { this._timeScale = timeScale; }

    public get TimeScale() : number
    { return this._timeScale; }

    public get IsBuzy() : boolean
    { return this._internalTweener !== null; }

    public Dispose() : void
    { this._isDisposed = true; }

    public get IsDisposed() : boolean
    { return this._isDisposed; }
}

// ##############################################

interface IInternalTweener
{
    Tween(delta : number) : void;
}

class InternalTweenerEmpty implements IInternalTweener
{
    public Tween(_delta: number): void
    {}
}

class InternalTweenerNum implements IInternalTweener
{
    private _from : number;
    private _to : number;
    private _onProgress : Action<[number]>|null;
    private _interpolation : eInterpolation;

    public constructor(from : number, to : number, onProgress : Action<[number]>|null, interpolation : eInterpolation)
    {
        this._from = from;
        this._to = to;
        this._onProgress = onProgress;
        this._interpolation = interpolation;
    }

    public Tween(delta: number): void
    {
        let result = Interpolations.InterpolateNum(this._from, this._to, delta, this._interpolation);
        this._onProgress?.Invoke(result);
    }
}