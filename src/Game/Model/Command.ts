import { IContext } from "./Context/Context";

export interface ICommand
{
    Exec(context: IContext): void;
}