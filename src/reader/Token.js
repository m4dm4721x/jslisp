// @flow

import type { TokenKind } from './TokenKind';

class Token {
  +tokenKind: TokenKind;
  +lexeme: () => string;
  +row: number;
  +column: number;

  constructor(tokenKind: TokenKind, row: number, column: number, lexeme?: () => string) {
    this.tokenKind = tokenKind;
    this.row = row;
    this.column = column;
    if (lexeme) {
      this.lexeme = lexeme;
    }
  }

  isOfKind(tokenKind: TokenKind): boolean {
    return this.tokenKind === tokenKind;
  }
}

export default Token;
