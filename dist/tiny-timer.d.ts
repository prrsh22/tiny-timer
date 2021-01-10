/// <reference types="node" />
import { EventEmitter } from 'events';
declare type Status = 'running' | 'paused' | 'stopped';
declare class Timer extends EventEmitter {
    private _interval;
    private _stopwatch;
    private _duration;
    private _endTime;
    private _pauseTime;
    private _status;
    private _timeoutID?;
    constructor({ interval, stopwatch }?: {
        interval?: number | undefined;
        stopwatch?: boolean | undefined;
    });
    start(duration: number, interval?: number): void;
    stop(): void;
    pause(): void;
    resume(): void;
    changeDuration(amount: number): void;
    private _changeStatus;
    private tick;
    get time(): number;
    get duration(): number;
    get status(): Status;
}
export default Timer;
