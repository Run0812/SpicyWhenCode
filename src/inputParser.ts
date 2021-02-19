import { fromEventPattern, from, Subscription, range, zip, ConnectableObservable, Observable } from "rxjs";
import { mergeMap, map, filter, publish, refCount, tap, share } from 'rxjs/operators';
import * as vscode from 'vscode';


export class InputEvent {
    text: string = '';
    offset: number;


    constructor(s: string, offset: number) {
        this.text = s;
        this.offset = offset;
    }

    toString() {
        return `text: ${this.text}, offset: ${this.offset}`;
    }
}


// 将vscode的输入事件转化为我需要的按键事件流
export class InputParser {

    private inputStream: Observable<InputEvent>;
    private holder: Subscription;


    constructor(input: vscode.Event<vscode.TextDocumentChangeEvent>) {
        // remove handler called when unsubscirbe
        this.inputStream = fromEventPattern<vscode.TextDocumentChangeEvent>(
            input,
            (_, disposable: vscode.Disposable) => {
                disposable.dispose(); console.log("onDidChangeTextDocument remove!");
            }).pipe(   // TODO 这部分要从类转换成方法，将这种转换抽象成一个操作
                mergeMap(
                    e => from(e.contentChanges).pipe(
                        filter(change => change.text.length >= 1), // TODO defaultIfEmpty 也许也行
                        mergeMap(this.convertEvent)
                    )
                ),
                share()
            );
        this.holder = this.inputStream.subscribe();

    }

    convertEvent(e: vscode.TextDocumentContentChangeEvent, index: number): Observable<InputEvent> {
        return zip(from(e.text), range(e.rangeOffset, e.text.length)).pipe(
            map(([chr, off]) => new InputEvent(chr, off)));
    }

    get stream(): ConnectableObservable<InputEvent> {
        return this.inputStream.pipe(publish()) as ConnectableObservable<InputEvent>;
    }

    dispose() {
        // 通过unsubsrcibe inputStream 触发对onDidChangeTextDocument的解监听
        console.log("InputParser dispose");
        this.holder.unsubscribe();
    }

}
