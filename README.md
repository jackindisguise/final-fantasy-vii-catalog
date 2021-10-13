![Version](https://img.shields.io/github/package-json/v/nowotato/final-fantasy-vii-catalog?style=for-the-badge)
[![Add All Scenes](https://img.shields.io/github/milestones/progress-percent/nowotato/final-fantasy-vii-catalog/1?label=scene-completion&style=for-the-badge)](https://github.com/nowotato/final-fantasy-vii-catalog/milestone/1)
[![Proofread Scenes](https://img.shields.io/github/milestones/progress-percent/nowotato/final-fantasy-vii-catalog/2?label=proofread-scenes&style=for-the-badge)](https://github.com/nowotato/final-fantasy-vii-catalog/milestone/2)

# About This Project
This project *had* only one goal: **match the Japanese dialogue with its official English translation.**

Once that's done, I can create flashcard decks with Japanese sentences on front and English on the back, which is a fantastic study resource for language-learners learning Japanese.

Since I started the project, the scope increase a little bit, and I had a few more ideas.
1. ✅ Compile a list of all kanji used in the game.
2. ✅ Compile a list of all non-dialogue text (enemy names, weapon names, armor names, accessory names, menu text, materia names, etc...).
3. Compile a list of most/all vocabulary used in the game.
4. ✅ Add everything to a website for future generations.

# Credit
#### Jason Maltz
This project is only possible due to the scene files compiled by **Jason Maltz**.

The original scene spreadsheet can be found in `spreadsheet/source.xlsx`.

#### MeCab
MeCab is a part-of-speech analyzer developed by **Taku Kudou** for the **Google Japanese Input project**.

I'm using it in this project to scrape nouns, adjective, adverbs, verbs,  from the scene files.

#### JMdict
JMdict is a Japanese-English dictionary created by **Jim Breen**.

By using MeCab to tokenize words and JMdict to look them up, I can create vocabulary files for the scenes.
For use in this project (and other projects), I wrote a script to convert JMdict's dictionary file to pure JSON.
I call it JSdict, and it can be found [here](https://github.com/nowotato/JSdict).

#### nowotato
All other spreadsheets, scripting files, generated text files, kanji lists, vocabulary lists, etc... were done by me.

# Anki
Anki is a spaced-repitition (flashcard) software.

All flashcard decks generated in this project will be made for use with Anki.

# Links:
* Download [Anki](https://apps.ankiweb.net/).
* Download my Anki decks: [Script](https://ankiweb.net/shared/info/1382550012) · [Misc. Text](https://ankiweb.net/shared/info/1700863070)
* Visit my [Github](https://github.com/nowotato/final-fantasy-vii-catalog) project.
* Visit my [project website](https://nowotato.github.io/final-fantasy-vii-catalog/).
* Visit my Google sheets: [Source](https://docs.google.com/spreadsheets/d/15j1daY2lC815kON_Lj1pOAIUgT3u9Pljn_OItqY-xHY/edit?usp=sharing) · [Uniform](https://docs.google.com/spreadsheets/d/15hmEPF-JQ7F0wcm8nlD3Ic9y8Ix2VOCP5sSI4zi3fpI/edit?usp=sharing) · [Formatted](https://docs.google.com/spreadsheets/d/1V3nNlDEZySQZzSKkVULG0hkyuMywq0jQB8xA2nPrPJ8/edit?usp=sharing) · [Processed](https://docs.google.com/spreadsheets/d/192VVNqbRRjMVa7XKZ2kVIvHyWHuP4audZ8TssQTNwK0/edit?usp=sharing) · [Misc. Text](https://docs.google.com/spreadsheets/d/1zReHSaUUPfFW7eEsJl53tEtGgxufpekUNw6JxlML2fg/edit?usp=sharing)

# Support Me
If you want to...

[![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/nowotato)
