
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
   
    $('#game tr td').attr('class', '');
    $('#status').removeClass('show');
  
    this.Player.push( new Player(0) );
    this.Player.push( new Player(1) );
    this.Board = new Board();
    this.Board.update();
    
    this.startTime = Date.now();

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
