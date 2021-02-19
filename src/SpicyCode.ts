import { ConnectableObservable, range, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as vscode from 'vscode';
import { InputEvent, InputParser } from "./inputParser";
import { keyword, keywordTime, nClick } from './spicyCondition';
import { SpicyHandler, changeCursor, deleteThisLine, insertText, getCurPos, moveCursorBy, setCursor } from './spicyHandler';

// 对外暴露总框架
export class SpicyCode implements vscode.Disposable {
     private parser: InputParser;
    private source: ConnectableObservable<InputEvent>;
    private inputConnection = new Subscription();

    constructor(input: vscode.Event<vscode.TextDocumentChangeEvent>) {
        this.parser = new InputParser(input);
        this.source = this.parser.stream;
        this.subscribe(this.source);
    }

    start() {
        console.log("SpicyCode is on!");
        this.inputConnection = this.source.connect();
    }

    exit() {
        console.log("SpicyCode is off!");
        this.inputConnection.unsubscribe();
    }

    dispose() {
        console.log("SpicyCode dispose");
        this.inputConnection.unsubscribe();
        this.parser.dispose();
    }

    private subscribe(input: ConnectableObservable<InputEvent>) {
        
        input.subscribe(console.log); // test

        // 随机光标
        input.subscribe(
            new SpicyHandler(e => changeCursor(Math.ceil(Math.random() * 6)))
        );

        input.pipe(filter(e => e.text.toLowerCase() === 'w')).subscribe(e => moveCursorBy(-1, 0));
        input.pipe(filter(e => e.text.toLowerCase() === 'a')).subscribe(e => moveCursorBy(0, -2));
        input.pipe(filter(e => e.text.toLowerCase() === 's')).subscribe(e => moveCursorBy(1, 0));
        input.pipe(filter(e => e.text.toLowerCase() === 'd')).subscribe(e => moveCursorBy(0, 2));
        
        input.pipe(keyword('return')).subscribe(e => deleteThisLine());
        
        input.pipe(
            keyword("for")
        ).subscribe(
            new SpicyHandler(e => {
                console.log(this);
                this.exit();
                insertText("for", getCurPos()!.end.translate(0,1)).then(() => this.start());
            })
        );

      


    }
}

// const config:SpicyMapping[] = [
//     {
//         condition:{},
//         handler:{} 
//     }
// ];



class SpicyMapping<T> {

    condition: SpicyCondition ;
    handler: SpicyHandler<T> ;

    constructor(condition:SpicyCondition, handler:SpicyHandler<T>) {
        this.condition = condition;
        this.handler = handler;
    }
}

class SpicyCondition {

    key:string;
    windowTime?:number;

    constructor(key:string, time?:number) {
        this.key = key;
        this.windowTime = time;
    }

}
