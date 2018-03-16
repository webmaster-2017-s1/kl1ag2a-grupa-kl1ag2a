
$(function() {

  new Game('#game-container', '#game-template')

});


var Game = function(element, template){

  this.element = $(element);
  this._template = template;

  this.init = function(){
    this.over = false;
    this.moves = 0;
    this._winPiece = [];
    this.startTime = Date.now();
    this.endTime = Date.now(); 
    this.Player = [];
    this.Board = null;
    this.activePlayer = 0; 
    this.updateMovesCount();
    this.maxThemes = 4;

    if (!this.template){
      this.template = $(this._template).html()
      this.element.append(this.template)
      this.bindEvents()

      
      var theme = readCookie('game-theme') || 1
      theme = parseInt(theme)
      this.setTheme( theme )
    }
  }

  this.setTheme = function(theme){
    this.theme = theme;
    $('body').attr('class', 'theme-0'+ theme)
    $('#theme span').text( theme )
    createCookie('game-theme', theme, 365)
  }

  this.bindEvents = function(){
    var self = this;

    $('#theme').click(function(e){
      e.preventDefault()
      if (!self.theme) self.theme = 1;
      self.theme++;
      if (self.theme > self.maxThemes) self.theme = 1
      self.setTheme( self.theme )
    })

    $('#restart', this.element).click(function(e){
      e.preventDefault();
      if (self.moves < 1) return;
      self.hideMenu()
      $('td.X, td.O', this.element).addClass('animated zoomOut')
      setTimeout(function(){
        self.restart();
      }, 750);
    });

   
    $('#game tr td', this.element).click(function(el, a, b){
      if(self.over) return;
      var col = $(this).index();
      var row = $(this).closest('tr').index();
      self.move( row +' '+ col );
      self.showMenu()
    });

    $('#game tr td', this.element).hover(function(){
      if(self.over) return;
      $(this).addClass('hover-'+ self.activePlayer);
    }, function(){
      if(self.over) return;
      $(this).removeClass('hover-0 hover-1');
    })

<<<<<<< HEAD
    
=======
   
>>>>>>> 99fc6875e0ec42018807783dcaaa9a65fb97053d
    $(this.element).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 'td.X', function(){
      $(this).attr('class', 'X')
    });

    $(this.element).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 'td.O', function(){
      $(this).attr('class', 'O')
    });

  }

  this.start = function(){
    this.hideMenu();
    this.init();
<<<<<<< HEAD
   
    $('#game tr td').attr('class', '');
    $('#status').removeClass('show');
  
=======
 
    $('#game tr td').attr('class', '');
    $('#status').removeClass('show');
    // 2 graczy
>>>>>>> 99fc6875e0ec42018807783dcaaa9a65fb97053d
    this.Player.push( new Player(0) );
    this.Player.push( new Player(1) );
    this.Board = new Board();
    this.Board.update();
    
    this.startTime = Date.now();

<<<<<<< HEAD
=======
 
>>>>>>> 99fc6875e0ec42018807783dcaaa9a65fb97053d
  };

  this.showMenu = function(){
    $('#menu').attr('class', '')
  }

  this.hideMenu = function(){
    $('#menu').attr('class', 'hidden')
  }

  this.restart = function(){
    clearInterval( this.timerHandle );
    this.start();
  }


  this.timer = function(){
    var self = this;
    var then = self.startTime;
    var format = function(now, then){
      return Date.create(then).relative();
    };
    this.timerHandle = setInterval(function(){
      var now = Date.now();
      $('#time').text( format(now, then) );
    }, 500);
  };

  this.parseInput = function(v){
    v = v.split(' ');
    var pos = Number(v[1]);
    if(v[0] == 1) pos = (pos+3);
    if(v[0] == 2) pos = (pos+6);
    return {
      row: v[0],
      col: v[1],
      index: pos
    };
  };

  
  this.tryMove = function(input){
    if(this.Board.board[input] == '_') return true;
    return false;
  };

  
  this.move = function(v){
    var Player = this.Player[ this.activePlayer ];
    v = this.parseInput(v);
    if(!this.tryMove(v.index)) return false;

    Player.moves.push( v.index );
    this.moves++;
    this.Board.board[v.index] = Player.symbol;
    this.activePlayer = (Player._id) ? 0 : 1; 
    this.Board.update();

    this.updateMovesCount();

    if(this.hasWon(Player)){
      this.gameOver(Player);
      return true;
    }

    if(this.moves >= 9) this.gameOver(null)

    return true;
  };

  this.gameOver = function(Player){
    if (!Player){
      $('td.X, td.O', this.element).addClass('animated swing')
      return $('#status').text('It\'s a Draw!').addClass('show');
    }


    var elements = '';
    for(var i=0; i<this._winPiece.length; i++){
      var p = this._winPiece[i]
      if (p < 3){
        elements += 'tr:eq(0) td:eq('+ p +'),';
      } else if( p < 6){
        elements += 'tr:eq(1) td:eq('+ (p-3) +'),';
      } else {
        elements += 'tr:eq(2) td:eq('+ (p-6) +'),';
      }
    }
    elements.slice(0, - 1); 

    var x = $( elements ).addClass('animated rubberBand')

    $('#status').text('Player '+ Player.symbol +' Wins!').addClass('show');
    this.over = true;

  }

  this.hasWon = function(Player){
    var won = false;
    var wins = Player.moves.join(' ');
    var self = this;

    this.Board.wins.each(function(n){
      if(wins.has(n[0]) && wins.has(n[1]) && wins.has(n[2])){
        won = true;
        self._winPiece = n;
        return true;
      }
    });
    return won;
  };

  this.updateMovesCount = function(){
    $('#time').text('Moves: '+ this.moves );
  }


  //
  // Start gry
  //
  this.start()

};




/**
 * Gracz z komputerem
 */
var Player = function(id, computer){
  this._id = id;
  this.symbol = (id == 0) ? 'X' : 'O';
  this.computer = (computer) ? computer : true; 
  this.moves = [];
};

var Board = function(){
  this.board = [
    '_','_','_',
    '_','_','_',
    '_','_','_'
  ];

  
  this.wins = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6],
    [1,4,7], [2,5,8], [0,4,8], [2,4,6]
  ];

  this.update = function(){
    var board = this.board;
    $('#game tr').each(function(x, el){
      $('td', el).each(function(i, td){
        var pos = Number(i);
        if(x == 1) pos = (pos+3);
        if(x == 2) pos = (pos+6);
        var txt = (board[pos] == '_') ? '' : board[pos];
        $(this).html( txt ).addClass( txt );
      });
    });
  };

};

function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}


