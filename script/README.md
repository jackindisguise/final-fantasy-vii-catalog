`process.js`
---
Exports the `process()` function for parsing formatted script text.

This function is very simple. It accepts 1 argument (the full text of the script) and does a few things:
* collapses all quote blocks in the English script (blocks that start with opening quotations “ and end with closing quotations ”) into 1 line;
* collapses all quote blocks in the Japanese script (blocks that start with opening brackets 「 and end with closing brackets 」) into 1 line;
* detects the beginning of quote blocks before the end of a quote block, and assumes the previous quote block ends there;
* removes all empty lines from both scripts;

Due to inconsistencies in the source spreadsheet, you have to do quite a lot of manual fixes. Most of them consist of:
* adding missing closing markers;
* adding opening and closing markers;
* removing incorrectly placed closing markers;
* replacing inconsistent opening/closing markers;
* re-combining dialogue that was split into multiple boxes due to space requirements (and other reasons) in the translated text;
* adding missing translations.

The ultimate goal is to have it so that *the text in the English script has the exact same number of "lines" as the text in the Japanese script*. Once all this formatting is done, each line in the English script is attached to the same line in the Japanese script. Matching lines is the only important thing.

The format of the processed text should be thus:

>`<English line>` `\t` `<Japanese line>`

`quick.js`
---
Processes the formatted script from `formatted.txt` and pops out the processed script in `processed.txt`.

`autoprocess.js`
---
Automatically processes all formatted scenes in `../text/formatted`

`generateKanjiTable.js`
---
Generates a Kanji table and stores it in `kanjiTable.JSON` for use in other scripts.

`generateKanjiInOrder.js`
---
Creates kanji lists from `kanjiTable.JSON` and places them in `../text/kanji/`.