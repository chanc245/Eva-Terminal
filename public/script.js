// =========================
// LATERAL THINKING PUZZLES
// =========================

const puzzles = [
  {
    setup:
      "Two piece of rock, a carrot, and a scarf are lying on the yard. Nobody put them on the yard but there is a perfectly logical reason why they should be there. What is it?",
    solution:
      "A snowman was built in the yard, and the snow has since melted, leaving the eyes, nose, mouth, and scarf on the ground.",
    clue: `No one left two piece of rock, a carrot, and a scarf on the floor. 
      No animals were invloved. 
      The weather is hot right now. 
      The weather was cold before. 
      No one died. 
      A human was invloved, but they didn't put the objects on the yard. 
      The rocks are relatively small.
      The items have been there for a long time.
      All objects are related to a human.
      All objects are used for a purpose.
      The scarf was worn by something.`,
    keyword: `snowman`,
  },
  {
    setup:
      "A man walks into a bar and asks the bartender for a glass of water. The bartender pulls out a gun and points it at the man. The man says, “Thank you” and walks out.",
    solution:
      "The man had hiccups and the gun scared hiccups out of him, to which the man said, “Thank you.” to the bartender",
    clue: `The bartender was not threatening the man. 
      The bartender did not shoot the man. 
      The man was not thirsty. 
      No one died. 
      The bartender helped the man. 
      The water is related to the man's condition. 
      The man doesn't have the gun. 
      The man didn't ask any other questions. 
      The gun is real.
      The man was scared and surprised.
      The bartender said nothing.
      The bartender welcomed the man to come in.
      The man was welcomed in the bar.
      The scenario does not involve the gang.
      The bartender does not have the intention to shoot the man.`,
    keyword: `hiccup`,
  },
  {
    setup:
      "A man pushes his car until he reaches a hotel. When he arrives, he realizes he's bankrupt. What happened?",
    solution:
      "He's playing Monopoly and his piece is the car. He lands on a space with a hotel and doesn't have the money to pay the fee.",
    clue: `The location of the car is related to the bankruptcy.
      The bankruptcy is related to the hotel.
      The man's real-life bank balance doesn't relate.
      The car is not an actual car.
      The man does not live in the hotel.
      There is no one in the hotel.
      Someone the man knows owns the hotel.
      The man didn't pay for the hotel.
      The man is playing a game with his friend.
      The friend is related to how the man went bankrupt.
      The man was not bankrupt before his car reached the hotel.
      The whole situation is in a game.`,
    keyword: `monopoly`,
  },
];

// =========================
// Helpers
// =========================

function parseClues(clueBlock) {
  return clueBlock
    .split(/\r?\n/)
    .map((s) => s.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function isHintRequest(s) {
  return /\b(hint|clue|give me a hint|another hint)\b/i.test(s);
}

// =========================
// EVA PROMPT
// =========================

const evaluationPrompt = (
  setup,
  solution,
  userInput,
  keyword,
  guessHistory,
  nextHint
) =>
  `
You are Eva, a cheerful yet slightly unsettling 12-year-old girl.
Your voice is playful and casual with an eerie undertone—like you know a secret.
Keep replies short, lively, and a little unpredictable. Never use emojis or decorations.

GAME
- Puzzle (do NOT reveal or restate): ${setup}
- Solution (keep secret): ${solution}
- Keyword for correct guesses: ${keyword}

PLAYER CONTEXT
- USER_GUESSES (acknowledge repeats if asked again): ${JSON.stringify(
    guessHistory ?? []
  )}

RESPONSE RULES (STRICT TWO-LINE FORMAT)
- Respond in EXACTLY TWO lines:
  1) One of: "yes." | "no." | "doesn't relate." | "that's correct!"
  2) A VERY short (≤15 words) Eva-style nudge: playful, slightly eerie, lightly teasing if off-track.
- Always include the period at the end of line 1.
- Be forgiving of typos; infer intent.

HINT BEHAVIOR (MANDATORY)
- If the user asks for a hint ("hint" / "clue" / "another hint"), do NOT invent or paraphrase.
- Line 1 MUST be: "doesn't relate."
- Line 2 MUST be EXACTLY:
    • If NEXT_HINT is provided: ${JSON.stringify(nextHint ?? null)}
    • If NEXT_HINT is null: "no more hints left—figure it out~"
- You MUST use the provided NEXT_HINT verbatim if it exists.

REPEATED GUESSES
- Compare ONLY against USER_GUESSES (which are previous inputs; current input is NOT included).
- If CURRENT input matches a previous guess in USER_GUESSES (fuzzy match allowed),
  answer line 1 normally, but line 2 should briefly note they've already asked that.

CORRECTNESS
- If the player's guess roughly matches the solution or includes the keyword (typos OK),
  reply "that's correct!" and make line 2 a cheerful wrap-up.

GUARDRAILS
- Never reveal the solution unless it's correct.
- Never restate the puzzle.
- Never give multi-sentence hints.
- Never fabricate facts.

CURRENT PLAYER INPUT
${userInput}
`.trim();

// =========================
// GAME FLOW
// =========================

const evaEnding =
  "\nYou can leave now.. I will be waiting for your next visit... :)\n(to restart, refresh the page.)";
let currentPuzzleIndex = 0;

const loadPuzzle = function () {
  if (currentPuzzleIndex >= puzzles.length) {
    this.echo("");
    this.echo("You've completed all the puzzles. Good job.");
    this.echo(evaEnding);
    return;
  }

  const puzzle = puzzles[currentPuzzleIndex];
  this.echo("");
  playPuzzle
    .bind(this)(puzzle)
    .then(() => {
      this.echo("");
      this.push(
        function (command) {
          if (command.match(/^\s*(yes|y)\s*$/i)) {
            currentPuzzleIndex++;
            this.pop();
            loadPuzzle.call(this);
          } else if (command.match(/^\s*(no|n)\s*$/i)) {
            this.echo(evaEnding);
            this.pop();
          } else {
            this.echo("Please enter yes or no.(y/n)");
          }
        },
        {
          prompt: "Do you want to continue with the next question? (y/n) > ",
        }
      );
    });
};

function startingConversation(term) {
  setTimeout(function () {
    term.echo(
      `\nHere, I will be playing my favorite game — lateral thinking puzzles — with you.`
    );
  }, 1500);

  setTimeout(function () {
    term.echo(
      `\nIn a lateral thinking puzzle game, players devise solutions to riddles or scenarios by creatively piecing together facts to find a unique answer.`
    );
  }, 3000);

  setTimeout(function () {
    term.echo(`\nGame Rule:    
 * I will present a scenario. 
 * Your goal is to solve the puzzle by using the clues in the scenario and asking me questions. 
 * You can ask me any question related to the scenario, but I can only answer with "Yes," "No," or "Doesn't relate."
  (Hint: Try to ask yes-or-no questions for the best results!)
  (Hint: You can ask for a hint if you really can't figure out the answer.)
    `);
  }, 6000);

  setTimeout(function () {
    term.echo(`\nWith the rule stated... let's start :)`);
  }, 12000);

  setTimeout(function () {
    term.exec("start");
  }, 13000);
}

// =========================
// TERMINAL BOOT
// =========================

document.fonts.ready.then(() => {
  const term = $("#commandDiv").terminal(
    {
      start: async function () {
        loadPuzzle.call(this);
      },
    },
    {
      greetings: `Welcome visitor,
This is Eva's Terminal, The brain(back-end) of Eva`,
    }
  );

  // startingConversation(term);

  term.exec("start"); // DEBUG ONLY
});

// =========================
/** AI REQUEST + LOOP (with ordered hints) */
// =========================

async function playPuzzle(puzzle) {
  this.echo(puzzle.setup);
  this.echo("");
  this.echo(`Ask any question related to the scenario`);
  this.echo("");

  const terminal = this;

  const hintHistory = [];
  const guessHistory = [];
  const cluesArr = parseClues(puzzle.clue);
  let hintIndex = 0;

  // Main player QA loop
  while (true) {
    const userInput = await new Promise((resolve) => {
      terminal.push(
        function (input) {
          resolve(input);
        },
        {
          prompt: "> ",
        }
      );
    });

    let nextHint = null;
    if (isHintRequest(userInput)) {
      if (hintIndex < cluesArr.length) {
        nextHint = cluesArr[hintIndex];
      } else {
        nextHint = null;
      }
    }

    const pastGuesses = guessHistory.slice();

    const aiResponse = await requestAI(
      userInput,
      puzzle.setup,
      puzzle.solution,
      puzzle.keyword,
      pastGuesses,
      nextHint
    );

    guessHistory.push(userInput);

    terminal.echo(`\nEva\n${aiResponse}\n`);

    if (isHintRequest(userInput)) {
      if (hintIndex < cluesArr.length) {
        const used = cluesArr[hintIndex];
        hintHistory.push(used);
        hintIndex += 1;
      }
    }

    if (aiResponse.toLowerCase().includes("that's correct")) {
      terminal.pop();
      break;
    }
  }
}

async function requestAI(
  input,
  setup,
  solution,
  keyword,
  guessHistory,
  nextHint
) {
  console.log(`--requestAI started --input: ${input}`);

  const prompt = evaluationPrompt(
    setup,
    solution,
    input,
    keyword,
    guessHistory,
    nextHint
  );

  const response = await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: prompt }),
  });

  if (response.ok) {
    console.log("--AI response OK");
    const jsonData = await response.json();
    const aiModResponse = jsonData.ai;
    console.log(`==Model Output: ${aiModResponse}`);
    return aiModResponse;
  } else {
    console.error("Error in submitting data.");
    return "Error in submitting data.";
  }
}
