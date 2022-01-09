# Wordle (yet another)

This wordle version uses some of the most frequent [language] words for your entertainement.

Languages (en, pt, ...), how many guesses and how many letters (5-8) are all configurable.

# Running locally

Run `npm i` to get the depedencies and then:

`npm run gen-words` (prime them words) followed by

`npm run play` for a default english, 5 letter, 6 guesses game.

If you want to configure your play, please use the options provided.

`npm run play -- --help` for more information.

In this version, Input/Output will all be your local terminal and a random word is choses everytime.

# Examples

![Example 1](https://github.com/7jpsan/wordle/blob/main/example.png)
![Example 2](https://github.com/7jpsan/wordle/blob/main/example-2.png)

# TODO:

1. Make a FE for it so we can publish to the wider world
1. Curate a set of words and dict on the languages rather than just getting some
1. Allow a shareable 'code' so your friends can do the same word
1. Show stats? Anyone caring?
1. Modes:
   _ Function of window of time to index a word (and previous words) more than 1 a day and don't reuse a word that has been used!!
   _ Random Mode (just for fun!)
1. Use it as base to learn Rust :-)
