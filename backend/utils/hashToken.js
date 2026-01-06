import crypto from 'crypto';

export default function hashToken(Token) {
    return crypto.createHash('sha256').update(Token).digest('hex')
}