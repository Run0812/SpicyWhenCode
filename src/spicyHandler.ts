import { Observer } from "rxjs";
import { InputEvent } from "./inputParser";
import * as vscode from 'vscode';


export class SpicyHandler<T> implements Observer<T> {
    closed?: boolean | undefined;
    error: (err: any) => void = e => console.log(e);
    complete: () => void = () => console.log("SpicyHandler Complete!");
    next: (value: T) => void;

    constructor (handler: (e: T) => void) {
        this.next = handler;
    }

}

export function setCursor(offset: number): void;
export function setCursor(anchor: vscode.Position, active: vscode.Position): void; 
export function setCursor(p1: vscode.Position | number, p2?: vscode.Position): void {
    const editor = vscode.window.activeTextEditor!;
    let startPos: vscode.Position;
    let endPos: vscode.Position;
    if (typeof p1 === 'number') {
        startPos = editor.document.positionAt(p1);
        endPos = startPos;
    }
    else {
        startPos = p1;
        endPos = p2!;
    }
    editor.selection = new vscode.Selection(startPos, endPos);
}


export function moveCursorBy(lineOffset:number, charOffset:number):void {
    const editor = vscode.window.activeTextEditor!;
    let pos = editor.selection.active.translate(lineOffset, charOffset);
    setCursor(pos, pos);
}

export function changeCursor(type: vscode.TextEditorCursorStyle) {
    const editor = vscode.window.activeTextEditor!;
    editor.options.cursorStyle = type;
}



export function insertText(text: string): Thenable<Boolean>;
export function insertText(text: string, pos: vscode.Position): Thenable<Boolean>;
export function insertText(text: string, pos?: vscode.Position): Thenable<Boolean> {
    const editor = vscode.window.activeTextEditor!;
    if (typeof pos === 'undefined') {
        pos = editor.selection.active;
    }
    return editor?.edit((builder) => builder.insert(pos!, text));
}

export function getCurPos() {
    return vscode.window.activeTextEditor?.selection;
}

export function deleteThisLine() {
    const editor = vscode.window.activeTextEditor!;
    let curPos = getCurPos()?.start!;
    let selection = new vscode.Selection(curPos?.line, 0, curPos?.line-1, 0);
    console.log(selection);
    return editor.edit(builder => builder.delete(selection));
}

// 
