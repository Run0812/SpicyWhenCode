// Condition 是可编程的Rxjs操作符号
import { pipe } from "rxjs";
import { bufferCount, timeout, retry, filter, bufferTime, tap } from "rxjs/operators";
import { InputEvent } from "./inputParser";


export function nTimes<T>(n: number, timeWindow: number) {
    return pipe(
        bufferTime<T>(timeWindow),
        filter(buffer => buffer.length >= n)
    );
};


export function keyword(keyword: string) {
    return pipe(
        bufferCount<InputEvent>(keyword.length, 1),
        filter<InputEvent[]>(buffer => buffer.map(e => e.text).join("") === keyword),
    );
}


export function keywordTime(keyword: string, timeWindow: number) {
    return pipe(
        bufferCount<InputEvent>(keyword.length, 1),
        timeout(timeWindow),
        retry(),
        filter<InputEvent[]>(buffer => buffer.map(e => e.text).join("") === keyword),
    );

}

export function nClick(key: string, n:number, timeWindow:number) {
    return pipe(
        filter<InputEvent>(e => e.text === key),
        nTimes(n, timeWindow)
    );
}