import { ITweenerManager } from '../../../Common/Tweener/Tweener';
import { Ghost } from './Ghost';

export class TargetingGhost extends Ghost
{
    public constructor(tweenManager: ITweenerManager)
    {
        super(tweenManager, "Ghost2");
    }
}
