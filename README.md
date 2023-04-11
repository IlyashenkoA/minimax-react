<h1 id="title">Game with MiniMax (Alpha Beta pruning) algorithm</h1>

<p id="description">This project is a simple game using the MiniMax algorithm and is also a remix of the project developed using C#. Rules of the game:
<ul>
<li>At the start of the game, a random string of numbers is generated, consisting of 0 and 1, for example, "101011"</li>
<li>Players perform moves in turn. The move involves replacing any two adjacent numbers, based on the following conditions: the pair of numbers 00 gives 1, 01 -> 0, 10 -> 1, and 11 -> 0. Only one pair of numbers can be substituted per turn.</li>
<li>The game ends when 2 numbers are obtained. If both numbers are the same (11 or 00), then the player wins who started the game is. If they are different (10 or 01), then the second player wins.</li>
</ul>
</p>

<h2>🚀 Demo</h2>

[https://minimax-react-czefasw0w-ilyashenkoa.vercel.app/](https://minimax-react-czefasw0w-ilyashenkoa.vercel.app/)

<h2>Project Screenshots:</h2>

<img src="https://i.imgur.com/7qyrF9y.png" alt="project-screenshot" width="700">

<img src="https://i.imgur.com/dztvq3y.png" alt="project-screenshot" width="700">

<img src="https://i.imgur.com/0Efk4G5.png" alt="project-screenshot" width="700">

<img src="https://i.imgur.com/lXmuoIy.png" alt="project-screenshot" width="700">

  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   It is possible to choose who starts the game
*   If the game was not finished and the page was reloaded the data will be saved
*   Possibility to choose the length of the row (optimal and maximum length - 10)

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the repository</p>

```
git clone https://github.com/IlyashenkoA/minimax-typescript-material.git
```

<p>2. Install all packages</p>

```
npm install
```

<p>3. Run the project</p>

```
npm run dev
```

  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   React
*   Redux
*   TypeScript
*   Material UI
