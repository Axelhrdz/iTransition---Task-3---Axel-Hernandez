const { SHA3 } = require('sha3');
const crypto = require('crypto');
const args = process.argv.slice(2);
const availableMoves = ['exit', ...args, 'help'];

function game() {
    // Check for repeated moves
    let moveSet = new Set(args);
    if (moveSet.size !== args.length) {
        console.log('Repeated moves are not allowed');
        return;
    }

    // Check for odd number of moves
    if (args.length % 2 === 0) {
        console.log('Invalid number of moves, please provide an odd number of moves, example: rock, paper, scissors');
        return;
    }

    // Determine victory conditions
    function getVictoryRules(moves) {
        const half = Math.floor(moves.length / 2);
        const rules = {};

        for (let i = 0; i < moves.length; i++) {
            rules[moves[i]] = {
                winsAgainst: [],
                losesTo: []
            };

            for (let j = 1; j <= half; j++) {
                rules[moves[i]].winsAgainst.push(moves[(i + j) % moves.length]);
                rules[moves[i]].losesTo.push(moves[(i - j + moves.length) % moves.length]);
            }
        }

        return rules;
    }

    const victoryRules = getVictoryRules(args);
    // console.log('Victory Rules:', victoryRules);

    // Computer move
    let computerMove = Math.floor(Math.random() * args.length);

    // Create random key
    const byteNumber = 32;
    const key = crypto.randomBytes(byteNumber);

    // Create hash of a message
    const message = args[computerMove];
    const hash = new SHA3(256);
    hash.update(message);
    const digest = hash.digest('hex');

    // Create HMAC using key and message
    const hmac = crypto.createHmac('sha256', key).update(message).digest('hex');
    console.log('HMAC: ', hmac);

    availableMoves.forEach((move, index) => {
        console.log(`${index} - ${move}`);
    });

    // Initiate readline interface
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Function to generate help table
    function showHelpTable() {
        const Table = require('cli-table3');
        const table = new Table({
            head: ['v PC\\User >', ...args],
            colWidths: Array(args.length + 1).fill(10),
        });

        args.forEach(userMove => {
            const row = [userMove];
            args.forEach(pcMove => {
                if (userMove === pcMove) {
                    row.push('Draw');
                } else if (victoryRules[userMove].winsAgainst.includes(pcMove)) {
                    row.push('Win');
                } else {
                    row.push('Lose');
                }
            });
            table.push(row);
        });

        console.log(table.toString());
        promptUser(); // Continue prompting the user after showing help
    }

    // Ask user to choose a move
    function promptUser() {
        readline.question('Choose your move: ', move => {
            const moveIndex = parseInt(move, 10);

            if (isNaN(moveIndex) || moveIndex < 0 || moveIndex >= availableMoves.length) {
                console.log(`Choose a valid move between the numbers 0 to ${availableMoves.length - 1}`);
                availableMoves.forEach((move, index) => {
                    console.log(`${index} - ${move}`);
                });
                promptUser(); // Reprompt if invalid input
            } else {
                const userMove = availableMoves[moveIndex];

                if (userMove === 'exit') {
                    console.log('Exiting the game...');
                    readline.close();
                    process.exit(0); // Exit the process
                } else if (userMove === 'help') {
                    showHelpTable();
                } else {
                    console.log(`Your move: ${userMove}`);
                    console.log(`Computer move: ${args[computerMove]}`);

                    if (userMove === args[computerMove]) {
                        console.log('Draw!');
                    } else if (victoryRules[userMove].winsAgainst.includes(args[computerMove])) {
                        console.log('You win!');
                    } else {
                        console.log('You lose!');
                    }
                    readline.close(); // Close readline after a valid move
                }
            }
        });
    }

    promptUser();
}

game();
