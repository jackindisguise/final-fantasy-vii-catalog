![Version](https://img.shields.io/github/package-json/v/nowotato/final-fantasy-vii-catalog?style=for-the-badge)
[![All Scenes](https://img.shields.io/github/milestones/progress-percent/nowotato/final-fantasy-vii-catalog/1?label=script-completion&style=for-the-badge)](https://github.com/nowotato/final-fantasy-vii-catalog/milestone/1)
[![Proofreading](https://img.shields.io/github/milestones/progress-percent/nowotato/final-fantasy-vii-catalog/2?label=proofreading&style=for-the-badge)](https://github.com/nowotato/final-fantasy-vii-catalog/milestone/2)

# About This Project
This project *had* only one goal: **match the Japanese dialogue with its official English translation.** When this was accomplished, I could do cool things like create flashcard decks with Japanese sentences on front and English on the back. Ultimately, it was started as a Japanese-learning resource, specifically for learning to read the story of Final Fantasy VII.

Since I started the project, the scope increase a little bit, and I had a few more ideas.
1. Compile a list of all kanji used in the game.
2. Compile a list of most/all vocabulary used in the game.
3. Add everything to a website for future generations.

# Credit
### Jason Maltz
This project is only possible due to the scene files compiled by ***Jason Maltz***.
The original scene spreadsheet can be found in `spreadsheet/source.xlsx`.

### nowotato
All other spreadsheets, scripting files, generated text files, kanji lists, vocabulary lists, etc... were done by me.

### MeCab
MeCab is a part-of-speech analyzer developed by **Taku Kudou** for the **Google Japanese Input project**.

I'm using it in this project to scrape nouns, adjective, adverbs, verbs,  from the scene files.

### JMdict
JMdict is a Japanese-English dictionary created by **Jim Breen**.

By using MeCab to tokenize words and JMdict to look them up, I can create vocabulary files for the scenes.
For use in this project (and other projects), I wrote a script to convert JMdict's dictionary file to pure JSON.
I call it JSdict, and it can be found [here](https://github.com/nowotato/JSdict).

# See also:
You can check out the web-based representation of this information on this project's gh-pages [here](https://nowotato.github.io/final-fantasy-vii-catalog/).