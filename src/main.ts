type LiteExp = (string|LiteExp)[];
type CharAmt = '0+'|'1+'|string|number|undefined;

class Litex {
    static _getCompiled = {
        liteExp: function(exp: LiteExp): string {
            return exp.join('');
        },
        charAmt: function(amt: CharAmt): string {
            if (!amt) return '';
    
            let stringifiedAmt: string = amt.toString();
            let amtType: number = 0;
            
            const acceptablePatterns = [/^\d+$/, /^\d+\+$/, /^\d+\.\.\d+$/];
            for (let i = 0; i < acceptablePatterns.length; i++) {
                const pattern = acceptablePatterns[i];
                if (pattern.test(stringifiedAmt)) {
                    amtType = i + 1;
                    break;
                } else if (i === acceptablePatterns.length - 1) {
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
    
            let compiledAmt: string = '';
            switch (amtType) {
                case 1:
                    compiledAmt = '{' + stringifiedAmt + '}?';
                    break;
                case 2:
                    compiledAmt = '{' + stringifiedAmt.slice(0, -1) + ',}?';
                    break;
                case 3:
                    const splittedAmt = stringifiedAmt.split('.')
                    const n1 = splittedAmt[0];
                    const n2 = splittedAmt[splittedAmt.length - 1];
    
                    compiledAmt = '{' + n1 + ',' + n2 + '}?';
                    break;
            }
            return compiledAmt;
        },
        chars: function(chars: string): string {
            const sensitiveChars = '.*+!?:()[]{}<>^$|\\';
            let compiledChars: string = '';
            for (let i = 0; i < chars.length; i++) {
                compiledChars += sensitiveChars.includes(chars[i]) ? '\\' + chars[i] : chars[i];
            }
            return compiledChars;
        }    
    }
    
    static getExp(matchAll: boolean, exp: LiteExp): RegExp {
        const regexMode = matchAll ? 'gm' : '';
        return new RegExp(this._getCompiled.liteExp(exp), regexMode);
    }

    static captureGroup(groupName: string, exp: LiteExp): string {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]+$/.test(groupName)) {
            throw new Error(`
                \rLitex: Invalid group name: \`${groupName}\`.
                \rCapture group name must only contain latin uppercase/lowercase letters,
                \rdigits and underscores and must not start with a digit.
            `);
        }
        return `(?<${groupName}>${this._getCompiled.liteExp(exp)})`;
    }
    static group(exp: LiteExp): string {
        return '(' + this._getCompiled.liteExp(exp) + ')';
    }
    
    static not(exp: LiteExp): string {
        return '[^' + this._getCompiled.liteExp(exp) + ']';
    }
    static insideOf(boundaries: [string, string], exp: LiteExp): string {
        const b1 = this._getCompiled.chars(boundaries[0]);
        const b2 = this._getCompiled.chars(boundaries[1]);
        return '(' + b1 + '(' + this._getCompiled.liteExp(exp) + ')' + b2 + ')';
    }
    static outsideOf(boundaries: [string, string], exp: LiteExp): string {
        //! MISSION UNREAL
        return '';
    }
    static anyFromList(exp: LiteExp): string {
        let finalExp: string = '[';
        exp.forEach(item => { finalExp += '(' + item + ')' });
        finalExp = finalExp + ']';
        return finalExp;
    }

    static char(char: string, amt?: CharAmt): string {
        return this._getCompiled.chars(char) + this._getCompiled.charAmt(amt);
    }
    static anychar(amt?: CharAmt): string {
        return '.' + this._getCompiled.charAmt(amt);
    }
    static seriouslyWhyWouldYouUseThatSuckExp(suckex: string): string {
        return suckex;
    }

    static linestart(amt?: CharAmt): string {
        return '^' + this._getCompiled.charAmt(amt);
    }
    static lineend(amt?: CharAmt): string {
        return '$' + this._getCompiled.charAmt(amt);
    }

    static whitespace(amt?: CharAmt): string {
        return '\\s' + this._getCompiled.charAmt(amt);
    }
    static newline(amt?: CharAmt): string {
        return '\\n' + this._getCompiled.charAmt(amt);
    }
    static tab(amt?: CharAmt): string {
        return '\\t' + this._getCompiled.charAmt(amt);
    }

    static return(amt?: CharAmt): string {
        return '\\r' + this._getCompiled.charAmt(amt);
    }
    static null(amt?: CharAmt): string {
        return '\\0' + this._getCompiled.charAmt(amt);
    }

    static digit(amt?: CharAmt): string {
        return '\\d' + this._getCompiled.charAmt(amt);
    }
    static az(amt?: CharAmt): string {
        return 'a-z' + this._getCompiled.charAmt(amt);
    }
    static AZ(amt?: CharAmt): string {
        return 'A-Z' + this._getCompiled.charAmt(amt);
    }

}

const myString = '<% sometext %> <% fff %>'
let pattern = Litex.getExp(false, [
    Litex.char('<%'),
    Litex.whitespace('0+'),
    Litex.captureGroup('main', [
        Litex.anychar('0+')
    ]),
    Litex.whitespace('0+'),
    Litex.char('%>'),
]);
let matches = myString.match(pattern);
console.log(
    matches?.groups,
    pattern
)