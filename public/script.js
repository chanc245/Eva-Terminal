// NORMAL JS FILE
// let gptRes = ''
let attempCounter = 15

$('#commandDiv').terminal({

  help: function () {
    this.echo(`
      \n type "counter" to check how many guess attemps you have left.
      \n`
    );
  },

  about: function () {
    this.echo(`
      \n Ara is powered by: OpenAI API, gpt-3.5-turbo-1106 
      \n Read more about OpenAI API: https://platform.openai.com/docs/overview 
      \n
      \n Thank you for visting! Hope you have a fun time here...
      \n`
    );
  },

  counter: function () {
    this.echo(`
      \n You have ${attempCounter} times to guess left.
    `)
  },

  ask: async function (input) {
    this.echo('(it might take up to 10 second for Ara to process, please be patient)');
    let gptRes = await requestGPT(input)
    this.echo(
      '\nAra' +
      `\n ${gptRes} \n`,
      console.log(`--POSTED requestGPT`)
    );
    console.log(gptRes)
  },

}, {
  greetings: `
    \n This is Ara from Spider Mansion, I will ask you question, and you will have to guess the answer based on the clues that you found,
    \n I will only answer Yes, No, or Doesn't relate.
    \n You will have ${attempCounter} attempts
    `});

async function requestGPT(input) {
  console.log(`--resuptGPT started --input: ${input}`)
  const response = await fetch('/submit', {
    method: 'POST',
    // we are doing a post request
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input })
  });

  if (response.ok) {
    console.log("--GPT response OK");

    const jsonData = await response.json();
    const gptResponse = jsonData.gpt;
    console.log(gptResponse);

    return gptResponse
  } else {
    return "Error in submitting data."
  }
}

