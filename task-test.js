const { SHA3 } = require('sha3');
const crypto = require('crypto');
const readline = require('readline');

const args = process.argv.slice(2);
const availableMoves = ['exit', ...args, 'help'];

// Check for an odd number of moves and at least three moves
if (args.length < 3 || args.length % 2 === 0) {
    console.error('Invalid number of moves. Please provide an odd number of moves, and at least three moves.');
    process.exit(1);
}

// TableGenerator class to determine the win/lose/draw rules
class TableGenerator {
    constructor(moves) {
        this.moves = moves;
    }

    generateTable() {
        const table = [];
        const n = this.moves.length;
        const half = Math.floor(n / 2);

        for (let i = 0; i < n; i++) {
            const row = [];
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    row.push('Draw');
                } else if ((j > i && j <= i + half) || (j < i && j + n <= i + half)) {
                    row.push('Win');
                } else {
                    row.push('Lose');
                }
            }
            table.push(row);
        }

        return table;
    }
}

// Game function
function game() {
    // Computer move
    const computerMoveIndex = Math.floor(Math.random() * args.length);
    const computerMove = args[computerMoveIndex];
    console.log(`Computer move: ${computerMove}`);

    // Generate HMAC
    const key = crypto.randomBytes(32);
    const hmac = crypto.createHmac('sha256', key).update(computerMove).digest('hex');
    console.log('HMAC:', hmac);

    // Print available moves
    availableMoves.forEach((move, index) => {
        console.log(`${index} - ${move}`);
    });

    // Initiate readline interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Table for determining the winner
    const tableGenerator = new TableGenerator(args);
    const rulesTable = tableGenerator.generateTable();

    // Ask user to choose a move
    function promptUser() {
        rl.question('Choose your move: ', move => {
            const userMoveIndex = parseInt(move);
            if (isNaN(userMoveIndex) || userMoveIndex < 0 || userMoveIndex >= availableMoves.length) {
                console.log(`Choose a valid move between the numbers 0 to ${availableMoves.length - 1}`);
                promptUser();
            } else if (userMoveIndex === 0 || userMoveIndex === availableMoves.length - 1) {
                if (userMoveIndex === 0) {
                    console.log('Exiting the game.');
                } else {
                    console.log('Help: Provide an odd number of moves, and at least three moves.');
                }
                rl.close();
            } else {
                const userMove = args[userMoveIndex - 1];
                console.log(`Your move: ${userMove}`);

                const result = rulesTable[computerMoveIndex][userMoveIndex - 1];
                console.log(`Result: ${result}`);
                
                console.log(`Computer move: ${computerMove}`);
                console.log(`HMAC key: ${key.toString('hex')}`);

                rl.close();
            }
        });
    }

    promptUser();
}

game();
