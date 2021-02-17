import { ConnectableObservable, Subscription } from 'rxjs';
import { bufferCount, retry, tap, timeout } from 'rxjs/operators';
import * as vscode from 'vscode';
import { InputEvent, InputParser } from "./inputParser";

// 对外暴露总框架
export class SpicyCode implements vscode.Disposable {
    private parser: InputParser;
    private source: ConnectableObservable<InputEvent>;
    private inputConnection = new Subscription();

    constructor(input: vscode.Event<vscode.TextDocumentChangeEvent>) {
        this.parser = new InputParser(input);
        this.source = <ConnectableObservable<InputEvent>> this.parser.stream;
        this.subscribe(this.source);
    }

    start() {
        vscode.window.showInformationMessage('Fuck U from SpicyWhenCode!');
        this.inputConnection = this.source.connect(); 
    }

    exit() {
        vscode.window.showInformationMessage('Fuck off from SpicyWhenCode!');
        this.inputConnection.unsubscribe();
    }

    dispose() {
        console.log("SpicyCode dispose");
        this.inputConnection.unsubscribe();
        this.parser.dispose();
    }

    private subscribe(input:ConnectableObservable<InputEvent>) {
        // test
        input.subscribe(
            (e) => {
                console.log(e);
            },
            console.error,
            () => {
                console.log('stream completed');
            }
        );

        input.pipe(
            bufferCount(3, 1),
            tap(x => console.log(x.map(ele => ele.text))),
            timeout(1000),
            retry()
        ).subscribe(
            {
                error(e) {
                    console.log(e);
                }
            }
            
        );
        
    }



}
