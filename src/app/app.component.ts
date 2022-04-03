import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  public number = 0;
  public gameFinished = false;

  constructor(private snackbar: MatSnackBar) {
  }

  onSubmit() {
    const playerScores:any = {};
    for(let i = 0; i < this.totalPlayers; i++) {
     const player = 'Player - ' + ( i + 1);
     this.displayedColumns.push(player);
     playerScores[player] = 0;
     const playerDetails = { previousNumber: 0, totalPoints: 0, penalty: false, Rank: 0, pointsAccumulated: false }
     this.playerInfo[(i + 1)] = playerDetails; 
    }
    this.dataSource = [playerScores];
    this.isSubmitted = true;
  }

  setDisplayedColumns() {

  }

  onReset() {
    this.dataSource = [];
    this.totalPlayers = 0;
    this.totalPoints = 0;
    this.displayedColumns = [];
    this.playerInfo = {};
    this.currentPlayer = 0;
    this.isSubmitted = false;
    this.gameFinished = false;
  }

  rollDice() {
    this.number = Math.floor((Math.random() * 6) + 1);
    if (this.currentPlayer === 0) { // game has just started
      this.currentPlayer = 1;
      this.dataSource[0]['Player - ' + this.currentPlayer] += this.number;
      this.playerInfo[this.currentPlayer]['previousNumber'] = this.number;
      this.playerInfo[this.currentPlayer]['totalPoints'] += this.number;
  
    } else if (this.playerInfo[this.currentPlayer]['penalty']) { // Reject the turn of the current player if it has penalty
      this.playerInfo[this.currentPlayer]['penalty'] = false;
      this.playerInfo[this.currentPlayer]['previousNumber'] = this.number;
  
    } else {
      if(this.number === 1 && this.playerInfo[this.currentPlayer]['previousNumber'] === 1) {
        this.playerInfo[this.currentPlayer]['penalty'] = true;
        this.playerInfo[this.currentPlayer]['previousNumber'] = this.number;
        const message = 'Player - ' + this.currentPlayer + ' is given Penalty';
        this.openSnackBar(message)
      } else {
        this.dataSource[0]['Player - ' + this.currentPlayer] += this.number;
        this.playerInfo[this.currentPlayer]['totalPoints'] += this.number;
        this.playerInfo[this.currentPlayer]['previousNumber'] = this.number;
      }    
    }
    this.setNextPlayer()

  }

  setNextPlayer() {
    const previousPlayer = this.currentPlayer;
    if (this.playerInfo[this.currentPlayer]['totalPoints'] >= this.totalPoints) {
      this.playerInfo[this.currentPlayer]['pointsAccumulated']= true;
    }
    this.sortPlayers();
      if(this.currentPlayer === this.totalPlayers && this.number !== 6) {   // if the turn was of last player
        const selectNextPlayer = Object.keys(this.playerInfo).find((e:any) => !this.playerInfo[e]['pointsAccumulated'])
        if (selectNextPlayer && this.number !== 6) {
          this.currentPlayer = parseInt(selectNextPlayer,10);
        } else {
          this.gameFinished = true;
        }
      } else if(this.number !== 6 || this.playerInfo[this.currentPlayer]['pointsAccumulated']) {
        const lessthanCurrentPlayer = [];
        const greaterThanCurrenPlayer = [];
        const sortedArray:any = Object.keys(this.playerInfo).map((e: any) => {
           return parseInt(e, 10)
          }
          );
        const currentKeyIndex = sortedArray.findIndex((player: any) => player === this.currentPlayer);
        if(currentKeyIndex !== -1) {
          if(currentKeyIndex !== 0) {
            lessthanCurrentPlayer.push(...sortedArray.slice(0, currentKeyIndex));
          }
          greaterThanCurrenPlayer.push(...sortedArray.slice(currentKeyIndex + 1));
          let selectNextPlayer = greaterThanCurrenPlayer.find((e) => !this.playerInfo[e]['pointsAccumulated'])
          if (selectNextPlayer) {
            this.currentPlayer = parseInt(selectNextPlayer, 10);
          } else {
            selectNextPlayer = lessthanCurrentPlayer.find((e) => !this.playerInfo[e]['pointsAccumulated'])
            if (selectNextPlayer) {
              this.currentPlayer = parseInt(selectNextPlayer, 10);
            } else {
              this.gameFinished = true;
            }
          }

        }

      }
      let message = '';
      if(this.playerInfo[this.currentPlayer]['penalty']) {
        message = 'Player - ' + this.currentPlayer + ' is having penalty'
        this.openSnackBar(message, true)
      }
      else {
        if(this.number === 6 && !this.playerInfo[previousPlayer]['pointsAccumulated']) {
          message = 'Player - ' + previousPlayer + ' You have one more Chance!!!'
        } else {
          message = 'Player - ' + this.currentPlayer + ' its your chance'
        }
        this.openSnackBar(message);
      }
      
}

    sortPlayers() {
      const sortedPlayers = Object.keys(this.playerInfo).sort((a,b) => {
        return this.playerInfo[b]['totalPoints'] - this.playerInfo[a]['totalPoints']
      });
      this.displayedColumns = [];
      for(let i = 0; i < sortedPlayers.length; i++) {
        const player = 'Player - ' + sortedPlayers[i];
        this.displayedColumns.push(player); 
      }
    }

      openSnackBar(message: string, isPlayerHavingPenalty = false) {
        this.snackbar.open(message, 'X', {
          duration: 1000
        });
        if(isPlayerHavingPenalty) {
          this.setNextPlayer();
        }
    }
}
