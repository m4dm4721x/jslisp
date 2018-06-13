// @flow

import type { TokenKind } from './TokenKind';
import Token from './Token';

function isAtomCharacter(c: string) {
  return /[a-zA-Z]/.test(c);
}

class Lexer {
  input: string;
  position: number;
  row: number;
  column: number;

  constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.row = 1;
    this.column = 1;
  }

  currentCharacter(): string {
    return this.input.charAt(this.position);
  }

  hasMoreInput(): boolean {
    return this.position < this.input.length;
  }

  handleCarriageReturn() {
    this.handleLineFeed();
    if (this.hasMoreInput() && this.currentCharacter() === '\n') {
      this.position += 1;
    }
  }

  handleLineFeed() {
    this.position += 1;
    this.row += 1;
    this.column = 1;
  }

  consumeCharacter() {
    this.position += 1;
    this.column += 1;
  }

  newToken(tokenKind: TokenKind): Token {
    const token = new Token(tokenKind, this.row, this.column);
    this.consumeCharacter();
    return token;
  }

  scanAtom(): Token {
    const startPosition = this.position;
    do {
      this.position += 1;
    } while (this.hasMoreInput() && isAtomCharacter(this.currentCharacter()));
    const result = new Token('ATOM', this.row, this.column, () => this.input.substring(startPosition, this.position));
    this.column += this.position - startPosition;
    return result;
  }

  getNextToken(): Token {
    while (this.hasMoreInput()) {
      switch (this.currentCharacter()) {
        case '\r':
          this.handleCarriageReturn();
          break;
        case '\n':
          this.handleLineFeed();
          break;
        case ' ':
          this.consumeCharacter();
          break;
        case '(':
          return this.newToken('LEFT_PARENTHESIS');
        case ')':
          return this.newToken('RIGHT_PARENTHESIS');
        default:
          if (isAtomCharacter(this.currentCharacter())) {
            return this.scanAtom();
          }
          throw new Error(`illegal character ${this.currentCharacter()} at position ${this.position}`);
      }
    }
    return this.newToken('END_OF_INPUT');
  }
}

export default Lexer;
