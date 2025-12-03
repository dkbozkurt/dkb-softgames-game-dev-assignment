export default class LoadingWindow {
    private readonly _preloader: HTMLElement;
    private readonly _preloaderBackground: HTMLElement;
    private readonly _preloaderAppIcon: HTMLImageElement;
    private readonly _preloaderAppName: HTMLElement;
    private readonly _preloaderBarFill: HTMLElement;

    constructor() {
        this._preloader = document.getElementById('application-preloader') as HTMLElement;
        this._preloaderBackground = this._preloader.querySelector('.preloader__background__overlay') as HTMLElement;
        this._preloaderAppIcon = this._preloader.querySelector('.preloader__app-icon') as HTMLImageElement;
        this._preloaderAppName = this._preloader.querySelector('.preloader__app-name') as HTMLElement;
        this._preloaderBarFill = this._preloader.querySelector('.preloader__bar__container__fill') as HTMLElement;
    }

    public updateLoadingProgress(progressRatio: number): void {
        this._preloaderBarFill.style.width = `${progressRatio * 100}%`;
    }

    public setPreloaderName(name: string): void {
        this._preloaderAppName.textContent = name;
    }

    public setPreloaderIcon(iconUrl: string): void {
        this._preloaderAppIcon.src = iconUrl;
    }

    public setPreloaderBackground(color: string): void {
        this._preloaderBackground.style.backgroundColor = color;
    }

    public completed(): void {
        this._preloader.classList.add('preloader__ended');
    }
}

