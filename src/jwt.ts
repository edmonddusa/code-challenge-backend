import {jwtDecode, JwtPayload} from "jwt-decode";

/**
 * Decodes the 'sub' (subject) claim from a given authorization header.
 *
 * @param {string | undefined} header - The authorization header containing the token.
 * @return {string | undefined} - The decoded 'sub' claim or undefined if the header is not provided or the token is invalid.
 */
export function decodeSubFromHeaders(header: string | undefined): string | undefined {
    if (!header) {
        return undefined;
    }
    return decodeFromToken(header)?.sub;
}

/**
 * Decodes a JWT (JSON Web Token) and returns its payload.
 *
 * @param {string} token - The JWT to be decoded.
 * @return {JwtPayload} The decoded payload of the JWT.
 */
export function decodeFromToken(token: string): JwtPayload {
    return jwtDecode(token);
}
