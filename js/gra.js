//
// Document Ready, Let's Play
//
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
    this.endTime = Date.now(); // reset this latter
    this.Player = [];
    this.Board = null;
    this.activePlayer = 0; // current active player (index of this.players)
    this.updateMovesCount();
    this.maxThemes = 4;

    if (!this.template){
      this.template = $(this._template).html()
      this.element.append(this.template)
      this.bindEvents()

      // store theme in cookie
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

    // bind input actions
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
