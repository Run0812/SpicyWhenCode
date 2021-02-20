
import { ConnectableObservable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import * as vscode from 'vscode';
import { InputEvent, InputParser } from "./inputParser";
import { keyword, keywordTime, nClick } from './spicyCondition';
import { SpicyHandler, changeCursor, deleteLine, insertText, getCurPos, moveCursorBy, replaceText, moveToken, pauseWhenExec } from './spicyHandler';
import { randomString } from './utils';

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

        // 随机光标
        input.subscribe(
            new SpicyHandler(e => changeCursor(Math.ceil(Math.random() * 6)))
        );


        input.pipe(nClick('w', 1, 400, true)).subscribe(e => moveCursorBy(-1, 0));
        input.pipe(nClick('a', 1, 400, true)).subscribe(e => moveCursorBy(0, -2));
        input.pipe(nClick('s', 1, 400, true)).subscribe(e => moveCursorBy(1, 0));
        input.pipe(nClick('d', 1, 400, true)).subscribe(e => moveCursorBy(0, 2));

        input.pipe(nClick('w', 2, 400)).subscribe(e => {
            let lastClick = e[e.length-1];
            pauseWhenExec(this, moveToken(lastClick.offset, -1, 0));
        });
        input.pipe(nClick('a', 2, 400)).subscribe(e => {
            let lastClick = e[e.length-1];
            pauseWhenExec(this, moveToken(lastClick.offset, 0, -1));
        });
        input.pipe(nClick('s', 2, 400)).subscribe(e => {
            let lastClick = e[e.length-1];
            pauseWhenExec(this, moveToken(lastClick.offset, 1, 0));
        });
        input.pipe(nClick('d', 2, 400)).subscribe(e => {
            let lastClick = e[e.length-1];
            pauseWhenExec(this, moveToken(lastClick.offset, 0, 1));
        });



        input.pipe(keyword('return')).subscribe(e => deleteLine(-1));
        input.pipe(keyword('del')).subscribe(e => deleteLine(0));


        input.pipe(
            keyword("for")
        ).subscribe(
            new SpicyHandler(e => {
                this.exit();
                insertText(" what? bro", getCurPos()!.end.translate(0, 1)).then(() => this.start());
            })
        );

        input.pipe(keyword('new')).subscribe(
            new SpicyHandler(e => {
                vscode.window.setStatusBarMessage('Happy New Year！');
                const workspace = vscode.workspace;
                let folders = workspace.workspaceFolders;
                if (typeof folders === 'undefined') {
                    vscode.window.setStatusBarMessage('New New Year！');
                }
                else {
                    let rootPath = folders[0].uri;
                    let fileName = randomString() + '.gl';
                    let newFile = vscode.Uri.joinPath(rootPath, fileName);
                    let edit = new vscode.WorkspaceEdit();
                    edit.createFile(newFile);
                    workspace.applyEdit(edit);
                }

            })
        );

        input.pipe(keyword('gg')).subscribe(
            new SpicyHandler(e => {
                let edit = new vscode.WorkspaceEdit();
                edit.deleteFile(vscode.window.activeTextEditor?.document.uri!);
                vscode.workspace.applyEdit(edit);
            })
        );

        input.pipe(keyword('split')).subscribe(
            new SpicyHandler(e => {
                const editor = vscode.window.activeTextEditor!;
                let selection = new vscode.Selection(
                    editor.document.positionAt(e[0].offset),
                    editor.document.positionAt(e[e.length - 1].offset).translate(0, 1)
                );
                pauseWhenExec(this, replaceText(' s p l i t ', selection));
            })

        );

        input.pipe(keyword('if')).subscribe(
            new SpicyHandler(e => pauseWhenExec(this, insertText(" I were a boy~", getCurPos()!.end.translate(0, 1))))
        );



    }
}

// const config:SpicyMapping[] = [
//     {
//         condition:{},
//         handler:{} 
//     }
// ];



// class SpicyMapping<T> {

//     condition: SpicyCondition ;
//     handler: SpicyHandler<T> ;

//     constructor(condition:SpicyCondition, handler:SpicyHandler<T>) {
//         this.condition = condition;
//         this.handler = handler;
//     }
// }

// class SpicyCondition {

//     key:string;
//     windowTime?:number;

//     constructor(key:string, time?:number) {
//         this.key = key;
//         this.windowTime = time;
//     }

// }
