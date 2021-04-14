How to Use
---
This is the script I wrote to quickly associate dialogue lines between the English and Japanese scripts, based on how they're formatted in the source spreadsheet.

You merely put the formatted script (tab-delimited) into `formatted.txt`, and then run `process.js` in `Node`.

It will pop out the processed text into `processed.txt`.

The format of the processed text should be thus:

>`<English line>` `\t` `<Japanese line>`

What the Script Does
---

* collapses all lines in the English script that start with opening quotations (“) and end with closing quotations (”) into 1 line;
* removes all empty lines from the English script;
* collapses all lines in the Japanese script that start with opening brackets (「) and end with closing brackets (」) into 1 line;
* removes all empty lines from the Japanese script.

Due to inconsistencies in the source spreadsheet, you have to do quite a lot of manual fixes. Most of them consist of:
* adding missing closing markers;
* adding opening and closing markers;
* removing incorrectly placed closing markers;
* replacing inconsistent/irregular opening/closing markers;
* re-combining dialogue that was split into multiple different boxes due to space requirements (and other reasons) in the translated text;
* adding missing translations.

The ultimate goal is to have it so that *the text in the English script has the exact same number of "lines" as the text in the Japanese script*. Once all this formatting is done, each line in the English script is attached to the same line in the Japanese script. Matching lines is the only important thing.