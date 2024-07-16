const { SHA3 } = require('sha3');
const args = process.argv.slice(2);
const availableMoves = ['exit', ...args, 'help'];





function game (){
    //Computer move
    let computerMove = Math.floor(Math.random() * args.length);
    console.log(computerMove);
    console.log(args[computerMove]);
    
    //Check for duplicate moves
    let checkDuplicate = new Set(args);
    if(checkDuplicate.size !== args.length){
        console.log('Duplicated moves are not allowed, please provide unique moves');
        return;
    }

    //Check for odd numbers of moves
    if(args.length % 2 === 0){
        console.log('Invalid number of moves, please provide an odd number of moves, example: rock, paper, scissors');
    } else {

        //Rules of the game
        function determineVictory(moves){
            const half = Math.floor(moves.length / 2);
            const rules = {};

            for(let i = 0; i < moves.length; i++){
                rules[moves[i]] = {
                    winsAgainst: [],
                    losesTo: []
                };

                for(let j = 1; j <= half; j++){
                    rules[moves[i]].winsAgainst.push(moves[i + j]) % moves.length;
                    rules[moves[i]].losesTo.push(moves[i - j]) % moves.length;
                }
            }

            return rules;
        }


        const victoryRules = determineVictory(args);
        console.log('Victory Rules: ', victoryRules);









        //create random key
        const crypto = require('crypto');
        const key = crypto.randomBytes(32);
        // console.log(key.toString('hex'));

        //create hash of a message
        const message = args[computerMove];
        const hash = new SHA3(256);
        hash.update(message);
        hash.digest('hex');
        // console.log(hash.digest('hex'));

        //create HMAC suing key and message
        const hmac = crypto.createHmac('sha256', key).update(message).digest('hex');
        console.log('HMAC: ', hmac);





        availableMoves.forEach((move, index) => {
            console.log(`${index} - ${move}`);
            // index ++;
            // console.log(index);
        });
        
        //Initiate readline interface
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        //Ask user to choose a move
        function promptUser(){
            readline.question('Choose your move: ', move => {
                // console.log(move);
                if(!move){
                    console.log('Please choose a move: ');
                    availableMoves.forEach((move, index) => {
                        console.log(`${index} - ${move}`);
                        index ++;
                    });
                    promptUser();
                } else if(!availableMoves.includes(availableMoves[move])) {
                    console.log(`Choose a valid move between the numbers 0 to ${availableMoves.length - 1}`);
                    availableMoves.forEach((move, index) => {
                        console.log(`${index} - ${move}`);
                        index ++;
                    });
                    promptUser();
                } else {
                    console.log(`Your move: ${availableMoves[move]}`);
                    readline.close();
                }
            });
        }

        promptUser();
        console.log('');






        
    }

    
}






game();



