// @flow

import TokenKind from './TokenKind';

class Token {
  tokenKind: TokenKind;
  lexeme: string;

  constructor(tokenKind: TokenKind, lexeme?: string) {
    this.tokenKind = tokenKind;
    if (lexeme !== undefined) {
      this.lexeme = lexeme;
    }
  }
}

export default Token;
