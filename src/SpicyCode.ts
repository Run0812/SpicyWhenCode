import * as vscode from 'vscode';
import { InputParser } from "./inputParser";

// 对外暴露总框架


export class SpicyCode implements vscode.Disposable {
    input: InputParser;


    constructor(input: vscode.Event<vscode.TextDocumentChangeEvent>) {
        this.input = new InputParser(input);
    }

    subscribe() {
        // for test
        this.input.subscribe(
            (e) => {
                console.log(`content: ${e.text}, offset: ${e.offset}`);
            },
            console.error,
            () => {
                console.log('stream completed');
            }

        );
    }


    dispose() {
        console.log("SpicyCode dispose");
        this.input.dispose();
    }

};
