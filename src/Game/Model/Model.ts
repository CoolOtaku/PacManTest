import { Action } from '../../Common/Action';
import { eDirection } from '../Direction';
import { CmdCreatePacMan } from './Commands/CmdCreatePacMan';
import { CmdMovePacMan } from './Commands/CmdMovePacMan';
import { Context, IContext } from './Context/Context';
import { EventManager, IEventManager } from './EventManager';
import { ITurn, ITurnInternal, Turn } from './Turn';
import { CmdCreateGhosts } from './Commands/CmdCreateGhosts';
import { CmdMoveGhosts } from './Commands/CmdMoveGhosts';
import { CmdCollisionGame } from './Commands/CmdCollisionGame';

export interface IModel
{
    get EventManager(): IEventManager;

    Init(): void;
    Update(direction: eDirection): void;
}

// ###################################

export class Model implements IModel
{
    private readonly _eventManager: EventManager;
    private readonly _context: IContext;

    // ================================

    public constructor()
    {
        this._eventManager = new EventManager();
        this._context = new Context(this._eventManager);
    }

    // ================================

    private CreateAndExecuteTurn(onInitTurn: Action<[ITurn]>) : void
    {
        const turn: ITurnInternal = new Turn();
        onInitTurn.Invoke(turn);
        turn.Exec(this._context);
    }

    // ========= IModel ===============

    public get EventManager(): IEventManager
    { return this._eventManager; }

    public Init(): void
    {
        this.CreateAndExecuteTurn(new Action((turn: ITurn) =>
        {
            turn.Push(new CmdCreatePacMan(0, 0));
            turn.Push(new CmdCreateGhosts(0, 11, 15, 11));
        },
        this));
    }

    public Update(direction: eDirection): void
    {
        this.CreateAndExecuteTurn(new Action((turn: ITurn) =>
        {
            turn.Push(new CmdMovePacMan(direction));
            turn.Push(new CmdMoveGhosts());
            turn.Push(new CmdCollisionGame())
        },
        this));
    }
}