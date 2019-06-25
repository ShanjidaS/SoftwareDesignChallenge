const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const baseUrl = "/api";
const selectionOptions = {
	none: "none",
	rock: "rock",
	paper: "paper",
	scissors: "scissors"
}
const gameResultOptions = {
	won: "You won",
	lost: "You lost",
	draw: "draw",
	wait: "Please wait for opponent to make a move.",
}

let userSelection = selectionOptions.none;

const buildPageHtml = (userSelection) => {
	return `
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js">  </script>
		<script type="text/javascript">
			async function makeSelection(selection) {
				//$.post("/api/select",{value: selection}, function(res) {});
				try {     
					const response = await fetch('/api/select', {
					  method: 'post',
					  headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					  },
					  body: JSON.stringify({value: selection})
					});
					const json = await response.json();
					alert(json.response);
				} catch(err) {
					console.log(err);
				}
			}
		</script>
		
		<h1>Rock, Paper, Scissors</h1>
		<div>
			<h5>${userSelection === selectionOptions.none ? 'Make a selection' : 'Please wait for your opponent'}</h5>
			<button ${userSelection === selectionOptions.none ? '' : 'disabled'} onclick="makeSelection('rock')">Rock</button>
			<button ${userSelection === selectionOptions.none ? '' : 'disabled'} onclick="makeSelection('paper')">Paper</button>
			<button ${userSelection === selectionOptions.none ? '' : 'disabled'} onclick="makeSelection('scissors')">Scissors</button>
		</div>
		
	`
}


app.get('/', (req, res) => {
	const htmlPage = buildPageHtml(userSelection);
	res.send(htmlPage);
});

app.post(baseUrl+'/select', (req, res) => {
	newSelection = req.body.value;
	let result = "";
	if (userSelection === selectionOptions.none) {
		result = gameResultOptions.wait;
		userSelection = req.body.value;
	} else if (newSelection === selectionOptions.paper && userSelection == selectionOptions.rock
			|| newSelection === selectionOptions.rock && userSelection == selectionOptions.scissors
			|| newSelection === selectionOptions.scissors && userSelection == selectionOptions.paper) {
		result = gameResultOptions.won;
		userSelection = selectionOptions.none;
	} else if (newSelection === selectionOptions.paper && userSelection == selectionOptions.paper
			|| newSelection === selectionOptions.rock && userSelection == selectionOptions.rock
			|| newSelection === selectionOptions.scissors && userSelection == selectionOptions.scissors) {
		result = gameResultOptions.draw;
		userSelection = selectionOptions.none;
	} else {
		result = gameResultOptions.lost;
		userSelection = selectionOptions.none;
	}
	
	res.send({response: result});
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))