# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.4](https://github.com/nowotato/final-fantasy-7-script/compare/v0.0.3...v0.0.4) (2021-04-16)


### Features

* Reconfigured the process scripts so we can automatically reprocess all scripts when updates are made. ([1b2c09c](https://github.com/nowotato/final-fantasy-7-script/commit/1b2c09c765ecca23cfb2603126c0cf45972aa6a4))
* Removed all escape code characters from the script. ([2ca5c04](https://github.com/nowotato/final-fantasy-7-script/commit/2ca5c0440e026ddce704ae3492d47d31c0320511))


### Bug Fixes

* Brought spreadsheets up to date. ([5253b01](https://github.com/nowotato/final-fantasy-7-script/commit/5253b014f1304f1e1b9f171e776932681049dbc7))
* Combined the flier into 1 line. ([8e109c0](https://github.com/nowotato/final-fantasy-7-script/commit/8e109c0e95e752431e14dd3c90d2dfcee57cca42))
* Flier should be 1 line. ([d2a920f](https://github.com/nowotato/final-fantasy-7-script/commit/d2a920fa1e5d174ec7f25820b33acbe0e891ee86))
* Forgot to generate kanji stuff. I need to automate this somehow. ([fc39dd2](https://github.com/nowotato/final-fantasy-7-script/commit/fc39dd29dacf571943c2d7039ca24d743af40558))
* Found escape codes (}) still lingering around. ([a7f42f6](https://github.com/nowotato/final-fantasy-7-script/commit/a7f42f6db65354389c47bb5e2f395fc976c79a6b))
* I guess my updates to the script revealed an inconsistency in scene 2. Yay. ([5c4997c](https://github.com/nowotato/final-fantasy-7-script/commit/5c4997c04840b2c5e1e2e531fbb273925d8ff811))
* Removed whitespace starting any lines in the script. ([981f3c8](https://github.com/nowotato/final-fantasy-7-script/commit/981f3c8d146a9c2bea678d87c3a4aa777ce694d0))
* Yet another flier collapsed into 1 line. ([73e1e6f](https://github.com/nowotato/final-fantasy-7-script/commit/73e1e6fb0f252a2247e79fea25f33d9b2606871e))

### [0.0.3](https://github.com/nowotato/final-fantasy-7-script/compare/v0.0.2...v0.0.3) (2021-04-16)


### Features

* Added scenes 8 and 9. ([e4bd589](https://github.com/nowotato/final-fantasy-7-script/commit/e4bd589daa23e824034f83754e790189b930fad8))
* Removes trailing linebreaks (generated in some circumstances during processing). ([cf6044e](https://github.com/nowotato/final-fantasy-7-script/commit/cf6044e77247721e185e71bf7fff3966316eef13))
* Script now detects when a new dialogue block starts in the middle of a dialogue block and assumes it's the end of the previous block. ([3ab2002](https://github.com/nowotato/final-fantasy-7-script/commit/3ab20023a06765f69b6a04847af2ba0700171067))


### Bug Fixes

* Anki ordering is annoying. Had to clear the deck and start over. ([636ef9c](https://github.com/nowotato/final-fantasy-7-script/commit/636ef9c14946477bf0074dd205c2b3ea4e1ec1fa))
* Fixed auto-closing script. ([12e48c1](https://github.com/nowotato/final-fantasy-7-script/commit/12e48c1d4e60a8ba4476a7f0b1470383d7d79989))
* Fixed uniform spreadsheet for scene 8. ([a353f25](https://github.com/nowotato/final-fantasy-7-script/commit/a353f250ed3a5cf03450d616c022dd57b0205c9f))
* Run pre-release stuff before standard-version in 1 command. ([84f3570](https://github.com/nowotato/final-fantasy-7-script/commit/84f35703ef2031ab050b2077ecf47f694c80522d))
* Too early to debug this, so I fixed it quick. ([2881206](https://github.com/nowotato/final-fantasy-7-script/commit/2881206d0758a68e9069f2f22ade1a17e3b9f777))

### [0.0.2](https://github.com/nowotato/final-fantasy-7-script/compare/v0.0.1...v0.0.2) (2021-04-15)


### Features

* Added prepublish script for auto-generating meta data related to the script. ([2aeb83c](https://github.com/nowotato/final-fantasy-7-script/commit/2aeb83cdf2c936961cf4751c47422d8d8c967dab))
* Added scripts for ripping kanji from the processed scripts. ([9f10c17](https://github.com/nowotato/final-fantasy-7-script/commit/9f10c1735ddf9aa3a51d86358eb579d1ebaca3d4))


### Bug Fixes

* **readme:** Added info about the project to the main README. ([07146ca](https://github.com/nowotato/final-fantasy-7-script/commit/07146ca74384c514bf18edf19371ab9f714779da))
* Updated README. ([892669a](https://github.com/nowotato/final-fantasy-7-script/commit/892669a58ec19e09d44d65261e2d777322d17985))

### 0.0.1 (2021-04-14)


### Features

* Added initial processing script, spreadsheets, and decks. ([55cc328](https://github.com/nowotato/final-fantasy-7-script/commit/55cc3284e5bb6f265f9e28dd8394753be17d3206))
* Added README files. ([f81af11](https://github.com/nowotato/final-fantasy-7-script/commit/f81af11927ec3df4a0160fbe93c1be7e8c597bd5))
* Added standard-version support. ([4c30857](https://github.com/nowotato/final-fantasy-7-script/commit/4c308574f6cfec778d834ba716fd80f8a50df851))


### Bug Fixes

* **readme:** Fixing formatting of README. ([7a8cb82](https://github.com/nowotato/final-fantasy-7-script/commit/7a8cb8273de622768914cde51bda92b1d9ef05a2))
* Fixed incorrect auto-generated readings of 神羅 in scene 7. ([a1bd864](https://github.com/nowotato/final-fantasy-7-script/commit/a1bd86432ec785fb6146b9253b3576e4de9fe1a9))
* Fixed unclosed lines in scene 7. ([0b8cccf](https://github.com/nowotato/final-fantasy-7-script/commit/0b8cccf929b69fc4e88bae5619cbc5b6a1edbe92))
* Ignoring input/output for process.js ([2128a5b](https://github.com/nowotato/final-fantasy-7-script/commit/2128a5b8b463893cf13df7e8cb494ecab0ef5f77))
* Updated deck and spreadsheet for fixed scene 7. ([c1e431b](https://github.com/nowotato/final-fantasy-7-script/commit/c1e431b510457c61a6395cf610a3b524bec7575a))
