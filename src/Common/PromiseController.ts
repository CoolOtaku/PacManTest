export class PromiseController<T>
{
    private _resolve!: (value: T) => void;
    private _reject!: (error: any) => void;
    public readonly Promise: Promise<T>;

    constructor()
    {
        this.Promise = new Promise<T>((resolve, reject) =>
        {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public Resolve(value: T): void
    {
        this._resolve(value);
    }

    public Reject(error: any): void
    {
        this._reject(error);
    }
}