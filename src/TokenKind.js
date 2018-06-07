import { Enum } from 'enumify';

class TokenKind extends Enum {}

TokenKind.initEnum(['LEFT_PARENTHESIS', 'RIGHT_PARENTHESIS', 'ATOM', 'END_OF_INPUT']);

export default TokenKind;
