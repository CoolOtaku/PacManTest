import { ICommand } from '../Command';
import { IContext } from '../Context/Context';
import { ICellObject } from '../Context/Internal/CellObject';
import { PacManGame } from '../../PacManGame';


export class CmdCollisionGame implements ICommand
{

    // ======= ICommand =========

    public Exec(context: IContext): void
    {
        const ghosts: ICellObject[] = context.Ghosts;
        const pacMan: ICellObject = context.PacMan;

        ghosts.forEach(ghost =>
        {
            if (this.CheckCollision(pacMan.X, pacMan.Y, ghost.X, ghost.Y))
                PacManGame.IS_RUN_GAME = false;
        }
        );
    }

    private CheckCollision(pacManX: number, pacManY: number, ghostX: number, ghostY: number): boolean
    {
        return pacManX === ghostX && pacManY === ghostY;
    }
}