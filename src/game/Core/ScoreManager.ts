import { Singleton } from "../../engine/Components/Singleton";

export type ScoreTitle = 'GameScore' | 'GameMoney';

export type ScoreFormat = '000' | '000' | '00' | '0' | '0.0' | '0.00' | '0.000' | '0.000';

export type ScoreLibrary = Partial<Record<ScoreTitle, ScoreElement>>;
export type ScoreChangedCallback = (score: number, scoreFormat: ScoreFormat) => void;

export type ScoreElementProps = {
    title: ScoreTitle,
    initialScore: number,
    stepValue?: number,
    scoreFormat?: ScoreFormat,
    checkForTargetValue?: boolean,
    targetValue?: number
}

class ScoreElement extends Singleton {
    private _scoreTitle: ScoreTitle;

    private _initialScore: number;
    private _stepValue: number = 1;

    private _scoreFormat: ScoreFormat;

    private _checkForTargetValue: boolean = false;
    private _targetValue: number;

    private _score: number;
    private _scoreString: string;

    private _onScoreChanged?: ScoreChangedCallback;

    private _scoreTextElements: HTMLElement[] = [];

    constructor({
        title,
        initialScore,
        stepValue = 1,
        scoreFormat = "0",
        checkForTargetValue = false,
        targetValue = 9999
    }: ScoreElementProps) {

        super();

        this._scoreTitle = title;
        this._initialScore = initialScore;
        this._stepValue = stepValue;
        this._scoreFormat = scoreFormat;
        this._checkForTargetValue = checkForTargetValue;
        this._targetValue = targetValue;

        this._score = initialScore;
        this._scoreString = this.formatScore(this._score, this._scoreFormat);

        this.scoreChanged();
    }

    public addScoreTextElement(textElement: HTMLElement) {
        this._scoreTextElements.push(textElement);
    }

    public removeScoreTextElement(textElement: HTMLElement) {
        const index = this._scoreTextElements.indexOf(textElement);
        if (index !== -1) {
            this._scoreTextElements.splice(index, 1);
        }
    }

    public get scoreTitle(): ScoreTitle {
        return this._scoreTitle;
    }

    public increase(targetValue: number = this._stepValue) {
        this._score += targetValue;
        this.scoreChanged();
    }

    public decrease(targetValue: number = this._stepValue) {
        this._score -= targetValue;
        this.scoreChanged();
    }

    public set(targetValue: number) {
        this._score = targetValue;
        this.scoreChanged();
    }

    public resetToInitial() { this.set(this._initialScore); }

    public resetToZero() { this.set(0); }

    public set onScoreChanged(callback: ScoreChangedCallback | undefined) {
        this._onScoreChanged = callback;
    }

    private scoreChanged() {
        this._scoreString = this.formatScore(this._score, this._scoreFormat);

        this.updateScoreTextElements(this._scoreString);

        if (this._onScoreChanged) {
            this._onScoreChanged(this._score, this._scoreFormat);
        }

        this.checkIfAchieved();
    }

    private updateScoreTextElements(targetScore: string) {
        this._scoreTextElements.forEach(scoreTextElement => {
            scoreTextElement.innerText = targetScore;
        });
    }

    private checkIfAchieved() {
        if (!this._checkForTargetValue) return;

        if (this._score >= this._targetValue) {
            console.log('Target value achieved for ' + this.scoreTitle);
        }
    }

    private formatScore(score: number, format: ScoreFormat): string {
        const match = format.match(/^(0+)(?:\.(0+))?$/);
        if (!match) {
            return String(score);
        }

        const integerZeros = match[1].length;
        const decimalZeros = match[2]?.length || 0;

        const fixedStr = score.toFixed(decimalZeros);

        if (decimalZeros === 0) {
            return fixedStr.padStart(integerZeros, '0');
        } else {
            const [intPart, decPart] = fixedStr.split('.');

            const paddedInt = intPart.padStart(integerZeros, '0');

            return `${paddedInt}.${decPart}`;
        }
    }

}

let instance: ScoreManager;

export default class ScoreManager {

    private _scoreLibrary!: ScoreLibrary;

    constructor() {

        if (instance) {
            return instance;
        }
        instance = this;
    }

    public subscribeToScoreElement(
        scoreTextElement: HTMLElement,
        scoreElementProps: ScoreElementProps,
        callback?: ScoreChangedCallback
    ) {
        let scoreElement: ScoreElement;

        if (scoreElementProps.title in this._scoreLibrary) {
            scoreElement = this.getScoreElement(scoreElementProps.title);
        }
        else {
            scoreElement = new ScoreElement(scoreElementProps);
            this._scoreLibrary[scoreElementProps.title] = scoreElement;
        }

        scoreElement.addScoreTextElement(scoreTextElement);

        if (callback) {
            scoreElement.onScoreChanged = callback;
        }
    }

    public unSubscribeToScoreElement(
        scoreTextElement: HTMLElement,
        scoreElementTitle: ScoreTitle
    ) {
        if (scoreElementTitle in this._scoreLibrary) {
            this.getScoreElement(scoreElementTitle).removeScoreTextElement(scoreTextElement);
        }
    }

    public getScoreElement(scoreTitle: ScoreTitle): ScoreElement {

        if (!(scoreTitle in this._scoreLibrary)) {
            throw new Error('Score Element not found in the score library');
        }

        return this._scoreLibrary[scoreTitle] as ScoreElement;
    }

}