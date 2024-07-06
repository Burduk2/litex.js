"use strict";
class Litex {
    static _getCompiled = {
        liteExp: function (exp) {
            return exp.join('');
        },
        charAmt: function (amt) {
            if (!amt)
                return '';
            let stringifiedAmt = amt.toString();
            let amtType = 0;
            const acceptablePatterns = [/^\d+$/, /^\d+\+$/, /^\d+\.\.\d+$/];
            for (let i = 0; i < acceptablePatterns.length; i++) {
                const pattern = acceptablePatterns[i];
                if (pattern.test(stringifiedAmt)) {
                    amtType = i + 1;
                    break;
                }
                else if (i === acceptablePatterns.length - 1) {
                    throw new Error(`
                        \rLitex: Invalid CharAmt: \`${amt}\`.
                        \rCharAmt must be of one of prototypes: 
                        \r\tunspecified
                        \r\tInteger
                        \r\t'Integer+'
                        \r\t'Integer..Integer'
                    `);
                }
            }
            let compiledAmt = '';
            switch (amtType) {
                case 1:
                    compiledAmt = '{' + stringifiedAmt + '}';
                    break;
                case 2:
                    compiledAmt = '{' + stringifiedAmt.slice(0, -1) + ',}';
                    break;
                case 3:
                    const splittedAmt = stringifiedAmt.split('.');
                    const n1 = splittedAmt[0];
                    const n2 = splittedAmt[splittedAmt.length - 1];
                    compiledAmt = '{' + n1 + ',' + n2 + '}';
                    break;
            }
            return compiledAmt;
        },
        chars: function (chars) {
            const sensitiveChars = '.*+!?:()[]{}^$|\\';
            let compiledChars = '';
            for (let i = 0; i < chars.length; i++) {
                compiledChars += sensitiveChars.includes(chars[i]) ? '\\' + chars[i] : chars[i];
            }
            return compiledChars;
        }
    };
    static getExp(matchAll, exp) {
        const regexMode = matchAll ? 'gm' : '';
        return new RegExp(this._getCompiled.liteExp(exp), regexMode);
    }
    static captureGroup(groupName, exp) {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]+$/.test(groupName)) {
            throw new Error(`
                \rLitex: Invalid group name: \`${groupName}\`.
                \rCapture group name must only contain latin uppercase/lowercase letters,
                \rdigits and underscores and must not start with a digit.
            `);
        }
        return `(?<${groupName}>${this._getCompiled.liteExp(exp)})`;
    }
    static group(exp) {
        return '(' + this._getCompiled.liteExp(exp) + ')';
    }
    static not(exp) {
        return '[^' + this._getCompiled.liteExp(exp) + ']';
    }
    static insideOf(boundaries, exp) {
        const b1 = this._getCompiled.chars(boundaries[0]);
        const b2 = this._getCompiled.chars(boundaries[1]);
        return '(' + b1 + '(' + this._getCompiled.liteExp(exp) + ')' + b2 + ')';
    }
    static outsideOf(boundaries, exp) {
        //! MISSION UNREAL
        return '';
    }
    static anyFromList(exp) {
        let finalExp = '[';
        exp.forEach(item => { finalExp += '(' + item + ')'; });
        finalExp = finalExp + ']';
        return finalExp;
    }
    static char(char, amt) {
        return this._getCompiled.chars(char) + this._getCompiled.charAmt(amt);
    }
    static anychar(amt) {
        return '.' + this._getCompiled.charAmt(amt);
    }
    static seriouslyWhyWouldYouUseThatSuckExp(suckex) {
        return suckex;
    }
    static linestart(amt) {
        return '^' + this._getCompiled.charAmt(amt);
    }
    static lineend(amt) {
        return '$' + this._getCompiled.charAmt(amt);
    }
    static whitespace(amt) {
        return '\\s' + this._getCompiled.charAmt(amt);
    }
    static newline(amt) {
        return '\\n' + this._getCompiled.charAmt(amt);
    }
    static tab(amt) {
        return '\\t' + this._getCompiled.charAmt(amt);
    }
    static return(amt) {
        return '\\r' + this._getCompiled.charAmt(amt);
    }
    static null(amt) {
        return '\\0' + this._getCompiled.charAmt(amt);
    }
    static digit(amt) {
        return '\\d' + this._getCompiled.charAmt(amt);
    }
    static az(amt) {
        return 'a-z' + this._getCompiled.charAmt(amt);
    }
    static AZ(amt) {
        return 'A-Z' + this._getCompiled.charAmt(amt);
    }
}
