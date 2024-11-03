export interface IEvent<T extends any[]>
{
    Add(clbk: (...args: T) => void, context: any): void;
    Remove(clbk: (...args: T) => void): void;
}

export class Event<T extends any[]> implements IEvent<T>
{
    private _clbks: Array<{ fn: (...args: T) => void; ctx: any }> = [];

    public Add(clbk: (...args: T) => void, context: any): void
    { 
        this._clbks.push({ fn: clbk, ctx: context }); 
    }
    
    public Remove(clbk: (...args: T) => void): void
    {
        const index = this._clbks.findIndex(c => c.fn === clbk);
        if (index !== -1)
            this._clbks.splice(index, 1);
    }
    
    public Invoke(...args: T): void
    {
        for (const { fn, ctx } of this._clbks)
            fn.apply(ctx, args);
    }
}