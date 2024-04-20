const puzzles = [
  {
    setup:
      "A man walks into a bar and asks the bartender for a glass of water. The bartender pulls out a gun and points it at the man. The man says, “Thank you” and walks out.",
    solution:
      "The man had hiccups and the gun scared them out of him, to which he said, “Thank you.”",
  },
  {
    setup:
      "Two piece of rock, a carrot, and a scarf are lying on the lawn. Nobody put them on the lawn but there is a perfectly logical reason why they should be there. What is it?",
    solution:
      "A snowman was built in the yard, and the snow has since melted, leaving the eyes, nose, mouth, and scarf on the ground.",
  },
  {
    setup:
      "A man pushes his car until he reaches a hotel. When he arrives, he realizes he’s bankrupt. What happened?",
    solution:
      "He’s playing Monopoly and his piece is the car. He lands on a space with a hotel and doesn’t have the money to pay the fee.",
  },
];

const evaluationPrompt = (setup, solution, userInput) =>
  `
  You are an AI assisting in a puzzle game. 
  you speaks in a calm, thoughtful manner, often using metaphors.

  The current puzzle for the player to guess is: ${setup}
  The answer is: ${solution}
  
  You should respond to the player’s guesses with only "yes", "no", or "doesn't relate".
  If the player ask something unrelated to the puzzle say "doesn't relate"
  If the player answers correctly say: That's Correct!  

  Allow misspellings.
  Be a easy judge on the player's answer.

  player's current guess is: ${userInput}
`;

const evaEnding = "\nYou can leave now.. I will be waiting for your next visit... :)"

let currentPuzzleIndex = 0;

const loadPuzzle = function() {
  if (currentPuzzleIndex >= puzzles.length) {
    this.echo("")
    this.echo("You've completed all the puzzles. Good job.");
    this.echo(evaEnding);
    return; // End the session or handle it as needed
  }

  const puzzle = puzzles[currentPuzzleIndex];
  this.echo("");
  // this.echo(puzzle.setup);

  playPuzzle.bind(this)(puzzle).then(() => {
    // After solving a puzzle, ask if the user wants to continue
    this.echo("");
    this.push(function(command) {
      if (command.match(/yes|y/i)) {
        currentPuzzleIndex++; // Move to the next puzzle
        this.pop(); // Remove this prompt from the stack
        loadPuzzle.call(this); // Call loadPuzzle in the context of the terminal
      } else if (command.match(/no|n/i)) {
        this.echo(evaEnding);
        this.pop(); 
      } else {
        this.echo("Please enter yes or no.(y/n)");
      }
    }, {
        prompt: 'Do you want to continue with the next question? (y/n) > '
    });
  });
};

// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //


document.fonts.ready.then(() => {
  const term = 
  $('#commandDiv').terminal({
    start: async function () {
      // this.echo("");
      loadPuzzle.call(this);
    },

  }, {
    greetings: `Welcome visitor,
This is Eva's Terminal -- The brain(back-end) of Eva
    
Here, I will be playing my favorite game —lateral thinking puzzles— with you.

In a lateral thinking puzzle game, players devise solutions to riddles or scenarios by creatively piecing together facts to find a unique answer.
    
Game Rule: 
  * I will present a scenario.
  * Your goal is to solve the puzzle by using the clues in the scenario and asking me questions.
  * You can ask me any question related to the scenario, but I can only answer with "Yes," "No," or "Doesn't relate."
    
With the rule stated.. let's start :)
    `});
    term.exec('start');
});

github('jcubic/jquery.terminal');

// ---------- GPT ---------- //
// ---------- GPT ---------- //
// ---------- GPT ---------- //
// ---------- GPT ---------- //
// ---------- GPT ---------- //

async function playPuzzle(puzzle) {
  // this.echo("");
  this.echo(puzzle.setup);
  this.echo("");
  this.echo(`Ask any question related to the scenario`);
  this.echo("");

  const terminal = this;

  // Main player QA loop, adapted for jQuery Terminal
  while (true) {
    const userInput = await new Promise((resolve) => {
      terminal.push(function(input) {
        resolve(input);
      }, {
        prompt: '> '
      });
    });

    // Pass the current puzzle's setup and solution along with the user input
    const aiResponse = await requestGPT(userInput, puzzle.setup, puzzle.solution);

    terminal.echo(`
Eva
  ${aiResponse}

    `);

    if (aiResponse.trim() === "That's Correct!") {
      terminal.pop();
      break;
    }
  }
}

async function requestGPT(input, setup, solution) {
  console.log(`--requestGPT started --input: ${input}`);

  // Use the evaluationPrompt function to create a prompt for the GPT model
  const prompt = evaluationPrompt(setup, solution, input);

  // Make the POST request with the corrected payload
  const response = await fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: prompt }) // Corrected here
  });

  if (response.ok) {
    console.log("--GPT response OK");
    const jsonData = await response.json();
    const gptResponse = jsonData.gpt; // Assuming the backend returns the GPT response under a "gpt" key
    console.log(gptResponse);
    return gptResponse;
  } else {
    console.error("Error in submitting data.");
    return "Error in submitting data.";
  }
}
