// @flow

import TokenKind from './TokenKind';
import Token from './Token';

function isWhitespace(c: string) {
  return c === ' ' || c === '\t';
}

function isAtomCharacter(c: string) {
  return !isWhitespace(c) && c !== '(' && c !== ')';
}

class Lexer {
  input: string;

  position: number;

  constructor(input: string) {
    this.input = input;
    this.position = 0;
  }

  hasMoreInput(): boolean {
    return this.position < this.input.length;
  }

  currentCharacter(): string {
    return this.input.charAt(this.position);
  }

  getNextToken(): Token {
    while (this.hasMoreInput() && isWhitespace(this.currentCharacter())) {
      this.position += 1;
    }
    if (!this.hasMoreInput()) {
      return new Token(TokenKind.END_OF_INPUT);
    }
    if (this.currentCharacter() === '(') {
      this.position += 1;
      return new Token(TokenKind.LEFT_PARENTHESIS);
    }
    if (this.currentCharacter() === ')') {
      this.position += 1;
      return new Token(TokenKind.RIGHT_PARENTHESIS);
    }
    const startPosition = this.position;
    do {
      this.position += 1;
    } while (this.hasMoreInput() && isAtomCharacter(this.currentCharacter()));
    return new Token(TokenKind.ATOM, this.input.substring(startPosition, this.position));
  }
}

export default Lexer;
