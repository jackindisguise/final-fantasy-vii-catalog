`process.js`
---
Reads the formatted script from `formatted.txt` and pops out the processed script in `processed.txt`.

The format of the processed text should be thus:

>`<English line>` `\t` `<Japanese line>`

This script is very simple, and only does 4 things:
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

`generateKanjiTable.js`
---
Generates a Kanji table and stores it in `kanjiTable.JSON` for use in other scripts.

`generateKanjiInOrder.js`
---
Creates kanji lists from `kanjiTable.JSON` and places them in `../text/kanji/`.