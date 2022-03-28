import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'RollOfTheDice';
  public totalPlayers: number = 0;
  public totalPoints: number = 0;
  public isSubmitted: boolean = false;
  public displayedColumns: string[] = [];
  public playerInfo:any = {};
  public dataSource:any = [];
  public currentPlayer = 0;

  onSubmit() {
    const playerScores:any = {};
    for(let i = 0; i < this.totalPlayers; i++) {
     const player = 'Player - ' + ( i + 1);
     this.displayedColumns.push(player);
     playerScores[player] = 0;
     const playerDetails = { previousNumber: 0, totalPoints: 0, penalty: false }
     this.playerInfo[(i + 1)] = playerDetails; 
    }
    this.dataSource = [playerScores];
    this.isSubmitted = true;
  }

  onReset() {
    this.dataSource = [];
    this.totalPlayers = 0;
    this.totalPoints = 0;
    this.displayedColumns = [];
    this.playerInfo = {};
    this.currentPlayer = 0;
    this.isSubmitted = false;
  }

  rollDice() {
    const number = Math.floor((Math.random() * 6) + 1);
    if (this.currentPlayer === 0) { // game has just started
      this.currentPlayer = 1;
      this.dataSource[0]['Player - ' + this.currentPlayer] += number;
      this.playerInfo[this.currentPlayer]['previousNumber'] = number;
      this.playerInfo[this.currentPlayer]['totalPoints'] += number;
      this.setNextPlayer()
    } else if (this.playerInfo[this.currentPlayer]['penalty']) { // Reject the turn of the current player if it has penalty
      this.playerInfo[this.currentPlayer]['penalty'] = false;
      this.setNextPlayer();
    } else {
      this.dataSource[0]['Player - ' + this.currentPlayer] += number;
      this.playerInfo[this.currentPlayer]['totalPoints'] += number;
    if(number === 6) {
      if(this.playerInfo[this.currentPlayer]['previousNumber'] === 6) {
        this.setNextPlayer();
      }
    } else {
      if(number === 1 && this.playerInfo[this.currentPlayer]['previousNumber'] === 1) {
        this.playerInfo[this.currentPlayer]['penalty'] = true;
      }
      this.setNextPlayer();
    }
    }
  }

  setNextPlayer() {
    if(this.currentPlayer === this.totalPlayers) {   // if the done is of last player
      this.currentPlayer = 1;
    } else {
      this.currentPlayer += 1;
    }
  }



}
