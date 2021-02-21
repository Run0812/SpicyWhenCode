import { Observer } from "rxjs";
import { InputEvent } from "./inputParser";
import * as vscode from 'vscode';
import { buffer } from "rxjs/operators";
import { SpicyCode } from "./SpicyCode";


type Handler<T> = (e: T) => void;

export class SpicyHandler<T> implements Observer<T> {
    closed?: boolean | undefined;
    error: (err: any) => void = e => console.log(e);
    complete: () => void = () => console.log("SpicyHandler Complete!");
    next: (value: T) => void;

    constructor(handler: Handler<T>) {
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

    editor.selection = new vscode.Selection(
        editor.document.validatePosition(startPos),
        editor.document.validatePosition(endPos)
    );
}

function clampPosition(line: number, character: number): vscode.Position {
    line = line < 0 ? 0 : line;
    character = character < 0? 0 : character;
    return vscode.window.activeTextEditor!.document.validatePosition(new vscode.Position(line, character));
}


export function moveCursorBy(lineOffset: number, charOffset: number): void {
    const editor = vscode.window.activeTextEditor!;
    let curPos = editor.selection.active;
    let setPos = clampPosition(curPos.line+lineOffset, curPos.character+charOffset);
    setCursor(setPos, setPos);
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


export function replaceText(text: string, pos: vscode.Selection) {
    const editor = vscode.window.activeTextEditor!;
    return editor?.edit(builder => builder.replace(pos, text));
}

export function moveToken(tokenAt: number, lineOffset: number, charOffset: number) {
    const editor = vscode.window.activeTextEditor!;
    let tokenPos = editor.document.positionAt(tokenAt);
    let tokenRange = editor.document.getWordRangeAtPosition(tokenPos)!;
    let token = editor.document.getText(tokenRange);
    let newPos: vscode.Position;
    if (charOffset < 0) {
        newPos = clampPosition(tokenRange.start.line + lineOffset, tokenRange.start.character + charOffset);
    }
    else {
        newPos = clampPosition(tokenRange.end.line + lineOffset, tokenRange.end.character + charOffset);
    }   
    return editor.edit(builder => {
        builder.delete(tokenRange);
        builder.insert(newPos, token);
    });
}


export function getCurPos() {
    return vscode.window.activeTextEditor?.selection;
}

export function deleteLine(lineOffset: number) {
    const editor = vscode.window.activeTextEditor!;
    let curPos = getCurPos()?.start!;
    let line = editor.document.lineAt(curPos.line + lineOffset);
    return editor.edit(builder => builder.delete(editor.document.validateRange(line.range)));
}

export function pauseWhenExec<T>(context: SpicyCode, handler: Thenable<T>) {
    context.exit();
    handler.then(() => context.start());
}
