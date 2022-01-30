let game;


function init()
{
game = new Game();
}

class Player
{
    constructor(index)
    {
        this.index = index;
        this.atTile = 0;
        this.pawn = document.getElementsByClassName("pawn" + index)[0];
        this.pawn.style.display = "block";
    }
}

class Tile
{
    constructor(div)
    {
        this.div = div;
        this.goto = -1;
    }
}

class Game
{
    constructor()
    {
        this.selectplayersDiv = document.getElementsByClassName("selectplayers")[0];
        this.winnerDiv = document.getElementsByClassName("winner")[0];
        this.playerturnDiv = document.getElementsByClassName("playerturn")[0];
        this.rollDiv = document.getElementsByClassName("roll")[0];
        this.mainDiv = document.getElementsByClassName("main")[0];
        this.boardDiv = document.getElementsByClassName("board")[0];
        this.boardoverlaydisplay = document.getElementsByClassName("selectplayers")[0];

        this.tiles = [];
        this.players = [];
        this.playerturn = 0;
        this.setupBoard();
    }
    setupBoard()
    {
        let path = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]

        let x = 0;
        let y = 10;
        let tileSize = 55;

        for (var i = 0; i < path.length; i++)
        {
            let cmd = path[i];
            if(cmd == 1)
            {
                //right
                x++;
            }
            else if (cmd == 3)
            {
                //left
                x--;
            }
            else if (cmd ==0)
            {
                //up
                y--;
            }

            let div = this.makeBoardDiv(x * tileSize, y * tileSize, i + 1)

            let tile = new Tile(div);
            this.tiles.push(tile);
        }

        this.setupGotos();
    }
    setupGotos()
    {
        //let op! deze tegelnummers beginnen 1
        let goto = [[6, 14], [16, 4], [17, 23], [27, 33], [29, 10], [38, 43], [39, 20], [45, 34]];

        for (var i = 0; i < goto.length; i++)
        {
            let element = goto[i];

            let start = element[0] - 1;
            let end = element[1] - 1;

            let tile = this.tiles[start];
            tile.goto = end;
        }

    }
    start(amountOfPlayers)
    {
        this.selectplayersDiv.style.display = "none";
        this.winnerDiv.style.display = "none";
        this.mainDiv.style.display = "block";

        let pawns = document.getElementsByClassName("pawn");
        for (var i = 0; i < pawns.length; i++)
        {
            pawns[i].style.display = "none"
        }

        this.players = [];

        for (var i = 0; i < amountOfPlayers; i++)
        {
            let player = new Player(i);
            this.players.push(player);
        }

        this.playerturn = -1;
        this.moveToNextPlayer();

    }
    moveToNextPlayer()
    {
        this.playerturn ++;
        if (this.playerturn == this.players.length)
        {
            this.playerturn = 0;
        }
        this.playerturnDiv.textContent = "Player " + (this.playerturn+1) ;
        
        this.draw();
    }
    draw()
    {
        for (var i = 0; i < this.players.length; i++)
        {
            this.setPawn(i, this.players[i].atTile);
        }
   
    }
    roll()
    {
        let eyes = Math.floor(Math.random() * 6) + 1;

        this.rollDiv.style.backgroundImage = "url('img/dice" + eyes + ".png')"

        let player = this.players[this.playerturn];
        player.atTile += eyes;

        if(player.atTile >= 49)
        {
            //winnaar
            this.winnerDiv.style.display = "block";
            this.winnerDiv.textContent = "Player " + (this.playerturn+1) + "wins!";
            this.mainDiv.style.display="none";
            return;
        }

        this.draw();


        //draw

        let tile = this.tiles[player.atTile];
        if(tile.goto != -1)
        {
            player.atTile = tile.goto;
            this.draw();
        }

        this.moveToNextPlayer();

    }
    setPawn(playerI, atTile)
    {

        let tile = this.tiles[atTile];

        let player = this.players[playerI];

        player.pawn.style.left = tile.div.style.left;

        player.pawn.style.top = tile.div.style.top;

        //halen we de tile op voor atTile
        // die heeft style met left top in het pixel formaat 10px

        // player heeft een pawn html element bewaard
        // die heeft eens tyle, en daar kun je dus de laft top van de tile opzetten
    }
    makeBoardDiv(x, y, tileDisplayNumber)
    {
        let div = document.createElement("div");

        div.className = "tile";
        div.style.left = x + "px";
        div.style.top = y + "px";
        div.textContent = tileDisplayNumber;

        this.boardDiv.appendChild(div);

        return div;
    }
}