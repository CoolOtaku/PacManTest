import { Assets, ResolverManifest } from "pixi.js";

export interface IResourceLoader
{
    Init(assetsManifest: string): Promise<void>;
    ForcedLoadAll(): Promise<void>;
}

// ###############################################

export class ResourceLoader implements IResourceLoader
{
    private _assetsManifest: ResolverManifest = { bundles: [] };
    private _loadedBundles: string[] = [];

    // ==========================================

    public async Init(assetsManifest: string): Promise<void>
    {
        let manifest = await this.FetchAssetsManifest(assetsManifest);
        this._assetsManifest = manifest;
        await Assets.init({ manifest: this._assetsManifest, basePath: 'assets' });
        const allBundles = this._assetsManifest.bundles.map((item) => item.name);
        Assets.backgroundLoadBundle(allBundles);
    }

    public async ForcedLoadAll(): Promise<void>
    {
        const allBundles = this._assetsManifest.bundles.map((item) => item.name);
        await this.LoadBundles(allBundles);
    }

    private CheckBundleExists(bundle: string): boolean
    {
        return !!this._assetsManifest.bundles.find((b) => b.name === bundle);
    }

    private async FetchAssetsManifest(url: string): Promise<ResolverManifest>
    {
        const response = await fetch(url);
        const manifest = await response.json();
        if (!manifest.bundles)
        {
            throw new Error('[Assets] Invalid assets manifest');
        }
        return manifest;
    }

    private async LoadBundles(bundles: string | string[]): Promise<void>
    {
        if (typeof bundles === 'string')
            bundles = [bundles];

        for (const bundle of bundles)
        {
            if (!this.CheckBundleExists(bundle))
            {
                throw new Error(`[Assets] Invalid bundle: ${bundle}`);
            }
        }

        const loadList = bundles.filter((bundle) => !this._loadedBundles.includes(bundle));

        if (!loadList.length)
            return;

        try
        {
            await Assets.loadBundle(loadList, (progress) =>
            {});
        }
        catch (error)
        {}

        this._loadedBundles.push(...loadList);
    }
}