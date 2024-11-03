import { ITweenerManager } from '../../../Common/Tweener/Tweener';
import { Ghost } from './Ghost';

export class RandomGhost extends Ghost
{
    public constructor(tweenManager: ITweenerManager)
    {
        super(tweenManager, "Ghost1");
    }
}
