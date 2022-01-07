import words, { wordList } from "random-words";
import { readFileSync } from "fs";
class Wordle {

}

class Game {

  private word: string = "";

  constructor(private letters: number) {
    console.log(words({ exactly: 10, maxLength: letters }));
  }


}

new Game(8);

for(let i in ['a',['b','c']]){
  console.log(i);
}