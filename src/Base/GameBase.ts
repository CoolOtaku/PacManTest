import { Application } from "pixi.js";
import { IResourceLoader, ResourceLoader } from "./ResourceLoader";

export abstract class GameBase
{
    protected readonly _app: Application<HTMLCanvasElement>;
    private _isResourcesLoaded: boolean = false;

    // ====================================

    public constructor(nodeName: string)
    {
        this._app = new Application<HTMLCanvasElement>({
            resolution: Math.max(window.devicePixelRatio, 1),
            backgroundColor: 0x505050,
        });

        let parent = document.getElementById(nodeName)!;
        parent.appendChild(this._app.view);

        this._app.ticker.add(() =>
        {
            let deltaTime = this._app.ticker.elapsedMS / 1000;

            if (this._isResourcesLoaded)
                this.OnUpdate(deltaTime);
        });

        window.addEventListener('resize', () =>
        {
            requestAnimationFrame(() =>
            {
                this.Resize();
            });
        });
        window.addEventListener('orientationchange', this.Resize.bind(this));
        this.Resize();
        this.LoadResources();
    }

    private async LoadResources(): Promise<void>
    {
        let resourceLoader : IResourceLoader = new ResourceLoader();
        await resourceLoader.Init("assets/assets-manifest.json");
        await resourceLoader.ForcedLoadAll();

        this._isResourcesLoaded = true;

        this.OnResourcesLoaded();
        this.Resize();
    }

    private Resize() : void
    {
        const parent = this._app.view.parentNode as HTMLElement;

        let windowWidth = parent.clientWidth;
        let windowHeight = parent.clientHeight;

        const width = windowWidth;
        const height = windowHeight;
        this._app.renderer.view.style.width = `${windowWidth}px`;
        this._app.renderer.view.style.height = `${windowHeight}px`;
        parent.scrollTo(0, 0);

        this._app.renderer.resize(width, height);

        if (this._isResourcesLoaded)
            this.OnResize(width, height);
    }

    // =====================================

    protected get Width() : number
    {
        const parent = this._app.view.parentNode as HTMLElement;
        return parent.clientWidth;
    }

    protected get Height() : number
    {
        const parent = this._app.view.parentNode as HTMLElement;
        return parent.clientHeight;
    }

    // =====================================

    protected abstract OnResourcesLoaded(): void;
    protected abstract OnUpdate(deltaTime: number): void;
    protected abstract OnResize(width: number, height: number): void;
}