import { ICommand } from "./Command"
import { IContext } from "./Context/Context"

export interface ITurn
{
    Push(command: ICommand): void
}

export interface ITurnInternal extends ITurn
{
    Exec(context: IContext): void;
}

// ##################################

export class Turn implements ITurnInternal
{
    private _commands: ICommand[] = [];

    // ========= ITurn ==============

    public Push(command: ICommand): void
    { this._commands.push(command); }

    // ====== ITurnInternal =========

    public Exec(context: IContext): void
    {
        for (let command of this._commands)
            command.Exec(context);
    }
}