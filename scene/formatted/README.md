Each text file in this folder corresponds to a sheet in the `formatted.xlsx` spreadsheet.

# Rules About Formatting
These files represent what is essentially the dialog boxes found in the game. Every line of this file has a tab separating the 2 different groups of text, with the English text on the left, and the Japanese text on the right. The goal at the end of processing these files is to *match* the text on the right with its translation on the left, collapsing each translation/original into 1 line separated by a tab.

#### Parsing English lines
The general rule for English lines is that they must start with “ (open paren) and end with ” (close paren).

Unfortunately, this is not 100% consistent, so there's a lot of formatting errors to be solved.

There are only 2 rules for parsing English lines:

###### `/“([^“”]+)(?=\r\n“)/g`
This is a formatting error correction rule. This rule detects lines where a dialog line starts (“) and then *doesn't end* before another line starts (“). Everything before the next “ is considered part of the previous line.

```
“This is a line.
“This is another line.
```

Everything before the next “ is considered part of the previous line.

###### `“([^”]+)”`
This is the *real* rule. Get everything between open and close parens and collapse it into 1 line.
```
“This is a line.”
“This is another line.”
```

Every line that lacks any of these formatting characters (“”) is considered its own isolated line.

#### Parsing Japanese lines
The general rule for Japanese lines is that they must start with 「 (open Japanese bracket) and end with 」 (close Japanese bracket).

There are only 2 rules for parsing Japanese lines:

###### `/「([^「」]+)(?=\r\n「)/g`
This is a formatting error correction rule. This rule detects lines where a dialog line starts (「) and then *doesn't end* before another line starts.

```
「This is a line.
「This is another line.
```

Everything before the next 「 is considered part of the previous line.

###### `/「([^」]+)」/g`
This is the *real* rule. Get everything between open and close brackets and collapse it into 1 line.

```
「This is a line.」
「This is another line.」
```

Every line that lacks any of these formatting characters (「」) is considered its own isolated line.