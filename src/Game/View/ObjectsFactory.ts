import { Container } from "pixi.js";
import { IPacMan, PacMan } from "./Objects/PacMan"
import { ITweenerManager } from "../../Common/Tweener/Tweener";
import { IGhost } from './Objects/Ghost';
import { RandomGhost } from './Objects/RandomGhost';
import { TargetingGhost } from './Objects/TargetingGhost';

export interface IObjectsFactory
{
    CreatePacMan() : IPacMan;
    CreateGhosts(): IGhost[];
}

// #########################################

export class ObjectsFactory implements IObjectsFactory
{
    private readonly _parent: Container;
    private readonly _tweenManager: ITweenerManager;

    // =======================================

    public constructor(parent: Container, tweenManager: ITweenerManager)
    {
        this._parent = parent;
        this._tweenManager = tweenManager;
    }

    // ======== IObjectsFactory ============

    public CreatePacMan() : IPacMan
    {
        const pacMan = new PacMan(this._tweenManager);
        this._parent.addChild(pacMan);
        return pacMan;
    }

    public CreateGhosts(): IGhost[]
    {
        const ghosts: IGhost[] = [];

        const ghost1 = new RandomGhost(this._tweenManager);
        this._parent.addChild(ghost1);
        ghosts.push(ghost1);

        const ghost2 = new TargetingGhost(this._tweenManager);
        this._parent.addChild(ghost2);
        ghosts.push(ghost2);

        return ghosts;
    }
}