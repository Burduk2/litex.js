# LiteExp (Litex)
### --- Or --- 
# Regex'ing doesn't suck anymore
Litex is a minimalistic library of functions that help achieve the versatility of regex while making expressions remain simple and dev-friendly

```bash
npm i litexp
```

## General usage
All Litex does is basically returning a RegExp, via `Litex.getExp(...)` function.

### Example usage:
```js
myString.replace(Litex.getExp(...), 'something');
```
Here you can see that you can use Litex directly where you would normally use regex.

## What to put inside of Litex.getExp() function
### For typescript enjoyers, here's a simplified declaration
```js
Litex.getExp(matchAll: boolean, expression: LiteExp): RegExp;
```
- matchAll is a boolean to define whether the expression will match all occurences or only first occurence.
- LiteExp is just an array of Litex charachters.

## Litex charachters
These charachters are used to create your LiteExp.

### First, example usage
```js
const pythonCommentPattern = Litex.getExp(true, [
    Litex.linestart(),
    Litex.whitespace('0+'),
    Litex.char('#'),
    Litex.anychar('0+'),
    Litex.lineend()
]);
```

**Here's the regex the previous code will produce:**

```js
/^\s{0,}#.{0,}$/gm
```

**Basically,**
all you do is write a sequence of any Litex charachters to form the final expression.

### Declaration of all Litex charachter funcs
**NOTE:** when you see '0+' or '1+' it is CharAmt argument in Litex charachter funcs. Here is how to use it and what is does:

| Arg                  | Occurences amount              |
| -------------------- | ------------------------------ |
| `unset`              | 1                              |
| `Int`                | `Int`                          |
| "`Int`+"             | `Int` or more occurences       |
| "`Int1`**..**`Int2`" | In range from `Int1` to `Int2` |

---

### Capture group
**Declaration:**
```js
Litex.captureGroup(groupName: string, exp: LiteExp)
```
Define a capture group that you can later access via `[<matches>].groups.[<groupName>]`.

<span style="color:#e55">Regex equivalent:</span>
`(?<GROUPNAME>...)`


[See code snippets](#using-capturegroup)

---

### Group

**Declaration:**
```js
Litex.group(exp: LiteExp)
```
Group multiple Litex chars.

<span style="color:#e55">Regex equivalent:</span>
`(...)`

---

### Not

**Declaration:**
```js
Litex.not(exp: LiteExp)
```
Exclude some expressions from the match.

<span style="color:#e55">Regex equivalent:</span>
`[^...]`


### Inside of

**Declaration:**
```js
Litex.insideOf(boundaries: [string, string], exp: LiteExp)
```
Match expression inside of specified boundaries.

<span style="color:#e55">Regex equivalent:</span>
`(BOUNDARY1(...)BOUNDARY2)`

---

### Any from list

**Declaration:**
```js
Litex.anyFromList(exp: LiteExp)
```
Match any Litex char inside of the list.

<span style="color:#e55">Regex equivalent:</span>
`[(ITEM1)(ITEM2)(...)]`

---

### Char

**Declaration:**
```js
Litex.char(char: string, amt?: CharAmt)
```
Add regular charachter(s) to an expression.

<span style="color:#e55">Regex equivalent:</span>
`MY CUSTOM CHARS`


---

### Anychar

**Declaration:**
```js
Litex.anychar(amt?: CharAmt)
```
Match any charachter.

<span style="color:#e55">Regex equivalent:</span>
`.`

---

### Linestart

**Declaration:**
```js
Litex.linestart(amt?: CharAmt)
```
Match line start.

<span style="color:#e55">Regex equivalent:</span>
`^`

---

### Lineend

**Declaration:**
```js
Litex.lineend(amt?: CharAmt)
```
Match line end.

<span style="color:#e55">Regex equivalent:</span>
`$`


---

### Whitespace

**Declaration:**
```js
Litex.whitespace(amt?: CharAmt)
```
Match any whitespace char.

<span style="color:#e55">Regex equivalent:</span>
`\s`

---

### Newline

**Declaration:**
```js
Litex.newline(amt?: CharAmt)
```
Match newline char.

<span style="color:#e55">Regex equivalent:</span>
`\n`

---

### Tab

**Declaration:**
```js
Litex.tab(amt?: CharAmt)
```
Match tab char.

<span style="color:#e55">Regex equivalent:</span>
`\t`

---

### Return

**Declaration:**
```js
Litex.return(amt?: CharAmt)
```
Match return char.

<span style="color:#e55">Regex equivalent:</span>
`\r`

---

### Null

**Declaration:**
```js
Litex.null(amt?: CharAmt)
```
Match null char.

<span style="color:#e55">Regex equivalent:</span>
`\0`

---

### Digit

**Declaration:**
```js
Litex.digit(amt?: CharAmt)
```
Match any digits.

<span style="color:#e55">Regex equivalent:</span>
`0-9`

---

### az

**Declaration:**
```js
Litex.az(amt?: CharAmt)
```
Match latin lowercase letters.

<span style="color:#e55">Regex equivalent:</span>
`a-z`

---

### AZ

**Declaration:**
```js
Litex.AZ(amt?: CharAmt)
```
Match latin uppercase letters.

<span style="color:#e55">Regex equivalent:</span>
`A-Z`



<br><br>


## Code snippets

### Using captureGroup()
```js

const myString = '<% sometext %>'
const match = myString.match(Litex.getExp(false, [
    Litex.char('<%'),
    Litex.whitespace('0+'),
    Litex.captureGroup('main', [
        Litex.anychar('0+')
    ]),
    Litex.whitespace('0+'),
    Litex.char('%>'),
]));

console.log(match.groups.main) //=> sometext

```