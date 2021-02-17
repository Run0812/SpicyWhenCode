
interface Handler {
    excuter(): void;
}

class CursorMotion implements Handler {
    
    excuter(): void {
        throw new Error("Method not implemented.");
    }

}

class TextModifier implements Handler {
       
    excuter(): void {
        throw new Error("Method not implemented.");
    }

}

