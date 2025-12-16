/**
 * Character counting utility for Mastodon compose
 * 
 * Mastodon counts URLs as 23 characters regardless of their actual length,
 * and remote mentions (@user@domain) are counted as just the local username (@user).
 * This matches the server-side behavior so the client character count is accurate.
 * 
 * This is a direct port of Mastodon's counter.js
 */

// @ts-expect-error - twitter-text types are incomplete
import regexSupplant from 'twitter-text/dist/lib/regexSupplant';
// @ts-expect-error - twitter-text types are incomplete
import validDomain from 'twitter-text/dist/regexp/validDomain';
// @ts-expect-error - twitter-text types are incomplete
import validPortNumber from 'twitter-text/dist/regexp/validPortNumber';
// @ts-expect-error - twitter-text types are incomplete
import validUrlPath from 'twitter-text/dist/regexp/validUrlPath';
// @ts-expect-error - twitter-text types are incomplete
import validUrlPrecedingChars from 'twitter-text/dist/regexp/validUrlPrecedingChars';
// @ts-expect-error - twitter-text types are incomplete
import validUrlQueryChars from 'twitter-text/dist/regexp/validUrlQueryChars';
// @ts-expect-error - twitter-text types are incomplete
import validUrlQueryEndingChars from 'twitter-text/dist/regexp/validUrlQueryEndingChars';

/**
 * URL regex - exact copy from Mastodon's url_regex.js
 * The difference with twitter-text's extractURL is that the protocol isn't optional.
 */
const urlRegex = regexSupplant(
    '(' +                                                          // $1 URL
    '(#{validUrlPrecedingChars})' +                              // $2
    '(https?:\\/\\/)' +                                          // $3 Protocol
    '(#{validDomain})' +                                         // $4 Domain(s)
    '(?::(#{validPortNumber}))?' +                               // $5 Port number (optional)
    '(\\/#{validUrlPath}*)?' +                                   // $6 URL Path
    '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?' +  // $7 Query String
    ')',
    {
        validUrlPrecedingChars,
        validDomain,
        validPortNumber,
        validUrlPath,
        validUrlQueryChars,
        validUrlQueryEndingChars,
    },
    'gi',
);

/**
 * Placeholder for URLs - exactly 23 characters (Mastodon's standard URL character count)
 * The $2 prefix preserves any preceding character that matched
 */
const urlPlaceholder = '$2xxxxxxxxxxxxxxxxxxxxxxx';

/**
 * Transform input text to countable text by:
 * 1. Replacing URLs with 23-character placeholders
 * 2. Replacing remote mentions with just the local username part
 * 
 * This is a direct port of Mastodon's countableText function from counter.js
 * 
 * @param inputText The raw text content from the editor
 * @returns Text with URLs and mentions normalized for counting
 */
export function countableText(inputText: string): string {
    return inputText
        .replace(urlRegex, urlPlaceholder)
        .replace(/(^|[^/\w])@(([a-z0-9_]+)@[a-z0-9.-]+[a-z0-9]+)/gi, '$1@$3');
}
