import { fromEventPattern, Observable, from, Subscription, range, zip } from "rxjs";
import { mergeMap, map, filter } from 'rxjs/operators';
import * as vscode from 'vscode';


class InputEvent {
    text: string = '';
    offset: number;


    constructor(s:string, offset:number) {
        this.text = s;
        this.offset = offset;
    }
}


// 将vscode的输入事件转化为我需要的按键事件流
export class InputParser {

    inputStream: Observable<InputEvent>;
    private _subscriptions: Subscription[] = [];


    constructor(input: vscode.Event<vscode.TextDocumentChangeEvent>) {
        // remove handler called when unsubscirbe
        this.inputStream = fromEventPattern<vscode.TextDocumentChangeEvent>(
            input,
            function (_, disposable: vscode.Disposable) {
                disposable.dispose();
            }).pipe(
                mergeMap(
                    (e) => {
                        return from(e.contentChanges).pipe(
                            filter(change => change.text.length >= 1), // TODO: defaultIfEmpty 也许也行
                            mergeMap(change => {
                                return zip(from(change.text), range(change.rangeOffset, change.text.length)).pipe(
                                    map(([chr, off]) => {return new InputEvent(chr, off);})
                                );                            
                            })
                        );
                    }
                )
            );
    }

    subscribe(next?: (value: InputEvent) => void, error?: (error: any) => void, complete?: () => void): void {
        this._subscriptions.push(this.inputStream.subscribe(next, error, complete));
 
    };


    dispose() {
        // 通过unsubsrcibe inputStream 触发对onDidChangeTextDocument的解监听
        console.log("InputParser dispose");
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }

}
