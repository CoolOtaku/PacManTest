export class Func<T extends any[], TResult>
{
    private _clbk : (...args : T) => TResult;
    private _context : any;

    public constructor(clbk : (...args : T) => TResult, context : any)
    {
        this._clbk = clbk;
        this._context = context;
    }

    public Invoke(...args : T) : TResult
    {
        return this._clbk.apply(this._context, args);
    }
}

export class Action<T extends any[]>
{
    private _clbk : (...args : T) => void;
    private _context : any;

    public constructor(clbk : (...args : T) => void, context : any)
    {
        this._clbk = clbk;
        this._context = context;
    }

    public Invoke(...args : T) : void
    {
        this._clbk.apply(this._context, args);
    }
}