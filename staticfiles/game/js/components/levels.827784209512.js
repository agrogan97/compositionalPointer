/*
    Rounds are formed by stringing together symbols, where the combined symbols represent an overall transformation.
    There are 4 functions in total, which are:
        A) score = score + 1
        B) score = score * -1
        C) score = score * 2
        D) score = 0

    To generate a round procedurally, we need:
        - Set of concepts to sample from
        - Composition depth
        - start score (-10 to 10)
        - computed target score
*/

function getRound(numConcepts, compDepth){
    /*
        Sample from the concept set based on some difficulty parameters and compute allowed scores
    */

    // Issue warning if no difficulty parameters are provided
    if (numConcepts == undefined || compDepth == undefined){
        console.log("[Warning]: Difficulty not defined in getRound() - did you mean to call computeScore() directly and provide your own sequence?")
    }

    // Define function mappings
    const allConcepts = ['A', 'B', 'C', 'D']
    const mapping = {
        A : function(score){return score + 1},
        B: function(score){return score * (-1)},
        C: function(score){return score * 2},
        D: function(score){return start}
    }

    // Get set of concepts to sample from
    // This is only used if we don't provide a sequence in advance
    let conceptSet = allConcepts.slice(0, numConcepts)
    let sequence = _.sampleSize(conceptSet, compDepth)

    return computeScore(sequence)
}

function defineCurriculum(curriculumType, numBlocks=2){
    console.log(numBlocks)
    // Function for defining curriculum types
    if (curriculumType == "linear"){
        // Linear type proceeds roughly as [1, 1] -> [2, 2] -> [3, 3] -> [4, 4]
        let levels = {
            1 : _.range(0, 10).map(i => ([1, 1])),
            2 : _.range(0, 10).map(i => ([2, 2])),
            3 : _.range(0, 10).map(i => ([3, 3])),
            4 : _.range(0, 10).map(i => ([4, 4])),
        }

        levels = _.concat(levels[1], levels[2], levels[3], levels[4])

        let allRounds = []
        levels.forEach(level => {
            // Levels contains a list of the difficulty levels as [number of concepts, planning depth]
            allRounds.push(getRound(level[0], level[1]))
        })

        return allRounds
    } else if (curriculumType == "BEstudy"){
        // Composition binding energy study
        // Blocked study of 4 blocks, each with 32 primitives, then 2x16 primitive pairs for 64 trials total per block

        const newBlock = () => {
            // --- Block params --- //
            const trialsPerBlock = 64;
            const trialsPerSubBlock = 16
            const primitives = ["A", "B", "C", "D"];
            const pairs = _.shuffle([
                ["A", "A"], ["A", "B"], ["A", "C"], ["A", "D"], 
                ["B", "A"], ["B", "B"], ["B", "C"], ["B", "D"], 
                ["C", "A"], ["C", "B"], ["C", "C"], ["C", "D"], 
                ["D", "A"], ["D", "B"], ["D", "C"], ["D", "D"]]);

            const triplets = [['A', 'A', 'A'], ['A', 'A', 'B'], ['A', 'A', 'C'], ['A', 'A', 'D'], ['A', 'B', 'A'], ['A', 'B', 'B'], ['A', 'B', 'C'], ['A', 'B', 'D'], ['A', 'C', 'A'], ['A', 'C', 'B'], ['A', 'C', 'C'], ['A', 'C', 'D'], ['A', 'D', 'A'], ['A', 'D', 'B'], ['A', 'D', 'C'], ['A', 'D', 'D'], ['B', 'A', 'A'], ['B', 'A', 'B'], ['B', 'A', 'C'], ['B', 'A', 'D'], ['B', 'B', 'A'], ['B', 'B', 'B'], ['B', 'B', 'C'], ['B', 'B', 'D'], ['B', 'C', 'A'], ['B', 'C', 'B'], ['B', 'C', 'C'], ['B', 'C', 'D'], ['B', 'D', 'A'], ['B', 'D', 'B'], ['B', 'D', 'C'], ['B', 'D', 'D'], ['C', 'A', 'A'], ['C', 'A', 'B'], ['C', 'A', 'C'], ['C', 'A', 'D'], ['C', 'B', 'A'], ['C', 'B', 'B'], ['C', 'B', 'C'], ['C', 'B', 'D'], ['C', 'C', 'A'], ['C', 'C', 'B'], ['C', 'C', 'C'], ['C', 'C', 'D'], ['C', 'D', 'A'], ['C', 'D', 'B'], ['C', 'D', 'C'], ['C', 'D', 'D'], ['D', 'A', 'A'], ['D', 'A', 'B'], ['D', 'A', 'C'], ['D', 'A', 'D'], ['D', 'B', 'A'], ['D', 'B', 'B'], ['D', 'B', 'C'], ['D', 'B', 'D'], ['D', 'C', 'A'], ['D', 'C', 'B'], ['D', 'C', 'C'], ['D', 'C', 'D'], ['D', 'D', 'A'], ['D', 'D', 'B'], ['D', 'D', 'C'], ['D', 'D', 'D']]

            // No I didn't type this out manually, I just ran it in Python using itertools and then copied it over rather than writing something from scratch in js
            const quads = [['A', 'A', 'A', 'A'], ['A', 'A', 'A', 'B'], ['A', 'A', 'A', 'C'], ['A', 'A', 'A', 'D'], ['A', 'A', 'B', 'A'], ['A', 'A', 'B', 'B'], ['A', 'A', 'B', 'C'], ['A', 'A', 'B', 'D'], ['A', 'A', 'C', 'A'], ['A', 'A', 'C', 'B'], ['A', 'A', 'C', 'C'], ['A', 'A', 'C', 'D'], ['A', 'A', 'D', 'A'], ['A', 'A', 'D', 'B'], ['A', 'A', 'D', 'C'], ['A', 'A', 'D', 'D'], ['A', 'B', 'A', 'A'], ['A', 'B', 'A', 'B'], ['A', 'B', 'A', 'C'], ['A', 'B', 'A', 'D'], ['A', 'B', 'B', 'A'], ['A', 'B', 'B', 'B'], ['A', 'B', 'B', 'C'], ['A', 'B', 'B', 'D'], ['A', 'B', 'C', 'A'], ['A', 'B', 'C', 'B'], ['A', 'B', 'C', 'C'], ['A', 'B', 'C', 'D'], ['A', 'B', 'D', 'A'], ['A', 'B', 'D', 'B'], ['A', 'B', 'D', 'C'], ['A', 'B', 'D', 'D'], ['A', 'C', 'A', 'A'], ['A', 'C', 'A', 'B'], ['A', 'C', 'A', 'C'], ['A', 'C', 'A', 'D'], ['A', 'C', 'B', 'A'], ['A', 'C', 'B', 'B'], ['A', 'C', 'B', 'C'], ['A', 'C', 'B', 'D'], ['A', 'C', 'C', 
            'A'], ['A', 'C', 'C', 'B'], ['A', 'C', 'C', 'C'], ['A', 'C', 'C', 'D'], ['A', 'C', 'D', 'A'], ['A', 'C', 'D', 'B'], ['A', 'C', 'D', 'C'], ['A', 'C', 'D', 'D'], ['A', 'D', 'A', 'A'], ['A', 'D', 'A', 'B'], ['A', 'D', 'A', 'C'], ['A', 'D', 'A', 'D'], ['A', 'D', 'B', 'A'], ['A', 'D', 'B', 'B'], ['A', 'D', 'B', 'C'], ['A', 'D', 'B', 'D'], ['A', 'D', 'C', 'A'], ['A', 'D', 'C', 'B'], ['A', 'D', 'C', 'C'], ['A', 'D', 'C', 'D'], ['A', 'D', 'D', 'A'], ['A', 'D', 'D', 'B'], ['A', 'D', 'D', 'C'], ['A', 'D', 'D', 'D'], ['B', 'A', 'A', 'A'], ['B', 'A', 'A', 'B'], ['B', 'A', 'A', 'C'], ['B', 'A', 'A', 'D'], ['B', 'A', 'B', 'A'], ['B', 'A', 'B', 'B'], ['B', 'A', 'B', 'C'], ['B', 'A', 'B', 'D'], ['B', 'A', 'C', 'A'], ['B', 'A', 'C', 'B'], ['B', 'A', 'C', 'C'], ['B', 'A', 'C', 'D'], ['B', 'A', 'D', 'A'], ['B', 'A', 'D', 'B'], ['B', 'A', 'D', 'C'], ['B', 'A', 'D', 'D'], ['B', 'B', 'A', 'A'], ['B', 'B', 
            'A', 'B'], ['B', 'B', 'A', 'C'], ['B', 'B', 'A', 'D'], ['B', 'B', 'B', 'A'], ['B', 'B', 'B', 'B'], ['B', 'B', 'B', 'C'], ['B', 'B', 'B', 'D'], ['B', 'B', 'C', 'A'], ['B', 'B', 'C', 'B'], ['B', 'B', 'C', 'C'], ['B', 'B', 'C', 'D'], ['B', 'B', 'D', 'A'], ['B', 'B', 'D', 'B'], ['B', 'B', 'D', 'C'], ['B', 'B', 'D', 'D'], ['B', 'C', 'A', 'A'], ['B', 'C', 'A', 'B'], ['B', 'C', 'A', 'C'], ['B', 'C', 'A', 'D'], ['B', 'C', 'B', 'A'], ['B', 'C', 'B', 'B'], ['B', 'C', 'B', 'C'], ['B', 'C', 'B', 'D'], ['B', 'C', 'C', 'A'], ['B', 'C', 'C', 'B'], ['B', 'C', 'C', 'C'], ['B', 'C', 'C', 'D'], ['B', 'C', 'D', 'A'], ['B', 'C', 'D', 'B'], ['B', 'C', 'D', 'C'], ['B', 'C', 'D', 'D'], ['B', 'D', 'A', 'A'], ['B', 'D', 'A', 'B'], ['B', 'D', 'A', 'C'], ['B', 'D', 'A', 'D'], ['B', 'D', 'B', 'A'], ['B', 'D', 'B', 'B'], ['B', 'D', 'B', 'C'], ['B', 'D', 'B', 'D'], ['B', 'D', 'C', 'A'], ['B', 'D', 'C', 'B'], ['B', 
            'D', 'C', 'C'], ['B', 'D', 'C', 'D'], ['B', 'D', 'D', 'A'], ['B', 'D', 'D', 'B'], ['B', 'D', 'D', 'C'], ['B', 'D', 'D', 'D'], ['C', 'A', 'A', 'A'], ['C', 'A', 'A', 'B'], ['C', 'A', 'A', 'C'], ['C', 'A', 'A', 'D'], ['C', 'A', 'B', 'A'], ['C', 'A', 'B', 'B'], ['C', 'A', 'B', 'C'], ['C', 'A', 'B', 'D'], ['C', 'A', 'C', 'A'], ['C', 'A', 'C', 'B'], ['C', 'A', 'C', 'C'], ['C', 'A', 'C', 'D'], ['C', 'A', 'D', 'A'], ['C', 'A', 'D', 'B'], ['C', 'A', 'D', 'C'], ['C', 'A', 'D', 'D'], ['C', 'B', 'A', 'A'], ['C', 'B', 'A', 'B'], ['C', 'B', 'A', 'C'], ['C', 'B', 'A', 'D'], ['C', 'B', 'B', 'A'], ['C', 'B', 'B', 'B'], ['C', 'B', 'B', 'C'], ['C', 'B', 'B', 'D'], ['C', 'B', 'C', 'A'], ['C', 'B', 'C', 'B'], ['C', 'B', 'C', 'C'], ['C', 'B', 'C', 'D'], ['C', 'B', 'D', 'A'], ['C', 'B', 'D', 'B'], ['C', 'B', 'D', 'C'], ['C', 'B', 'D', 'D'], ['C', 'C', 'A', 'A'], ['C', 'C', 'A', 'B'], ['C', 'C', 'A', 'C'], ['C', 'C', 'A', 'D'], ['C', 'C', 'B', 'A'], ['C', 'C', 'B', 'B'], ['C', 'C', 'B', 'C'], ['C', 'C', 'B', 'D'], ['C', 'C', 'C', 'A'], ['C', 'C', 'C', 'B'], ['C', 'C', 'C', 'C'], ['C', 'C', 'C', 'D'], ['C', 'C', 'D', 'A'], ['C', 'C', 'D', 'B'], ['C', 'C', 'D', 'C'], ['C', 'C', 'D', 'D'], ['C', 'D', 'A', 'A'], ['C', 'D', 'A', 'B'], ['C', 'D', 'A', 'C'], ['C', 'D', 'A', 'D'], ['C', 'D', 'B', 'A'], ['C', 'D', 'B', 'B'], ['C', 'D', 'B', 'C'], ['C', 'D', 'B', 'D'], ['C', 'D', 'C', 'A'], ['C', 'D', 'C', 'B'], ['C', 'D', 'C', 'C'], ['C', 'D', 'C', 'D'], ['C', 'D', 'D', 'A'], ['C', 'D', 'D', 'B'], ['C', 'D', 'D', 'C'], ['C', 'D', 'D', 'D'], ['D', 'A', 'A', 'A'], ['D', 'A', 'A', 'B'], ['D', 'A', 'A', 'C'], ['D', 'A', 'A', 'D'], ['D', 'A', 'B', 'A'], ['D', 'A', 'B', 'B'], ['D', 'A', 'B', 'C'], ['D', 'A', 'B', 'D'], ['D', 'A', 'C', 'A'], ['D', 'A', 'C', 'B'], ['D', 'A', 'C', 'C'], ['D', 'A', 'C', 'D'], ['D', 'A', 'D', 'A'], ['D', 'A', 'D', 'B'], ['D', 'A', 'D', 'C'], ['D', 'A', 'D', 'D'], ['D', 'B', 'A', 'A'], ['D', 'B', 'A', 'B'], ['D', 'B', 'A', 'C'], ['D', 'B', 'A', 'D'], ['D', 'B', 'B', 'A'], ['D', 'B', 'B', 'B'], ['D', 'B', 'B', 'C'], ['D', 'B', 'B', 'D'], ['D', 'B', 'C', 'A'], ['D', 'B', 'C', 'B'], ['D', 'B', 'C', 'C'], ['D', 'B', 'C', 'D'], ['D', 'B', 'D', 'A'], ['D', 'B', 'D', 'B'], ['D', 'B', 'D', 'C'], ['D', 'B', 'D', 'D'], ['D', 'C', 'A', 'A'], ['D', 'C', 'A', 'B'], ['D', 'C', 'A', 'C'], ['D', 'C', 'A', 'D'], ['D', 'C', 'B', 'A'], ['D', 'C', 'B', 'B'], ['D', 'C', 'B', 'C'], 
            ['D', 'C', 'B', 'D'], ['D', 'C', 'C', 'A'], ['D', 'C', 'C', 'B'], ['D', 'C', 'C', 'C'], ['D', 'C', 'C', 'D'], ['D', 'C', 'D', 'A'], ['D', 'C', 'D', 'B'], ['D', 'C', 'D', 'C'], ['D', 'C', 'D', 'D'], ['D', 'D', 'A', 'A'], ['D', 'D', 'A', 'B'], ['D', 'D', 'A', 'C'], ['D', 'D', 'A', 'D'], ['D', 'D', 'B', 'A'], ['D', 'D', 'B', 'B'], ['D', 'D', 'B', 'C'], ['D', 'D', 'B', 'D'], ['D', 'D', 'C', 'A'], ['D', 'D', 'C', 'B'], ['D', 'D', 'C', 'C'], ['D', 'D', 'C', 'D'], ['D', 'D', 'D', 'A'], ['D', 'D', 'D', 'B'], ['D', 'D', 'D', 'C'], ['D', 'D', 'D', 'D']]

            let block = {
                // primitives: _.range(0, trialsPerBlock/2).map(i => [_.sample(primitives)]), // 32 primitives
                primitives: _.range(0, trialsPerSubBlock).map(i => [_.sample(primitives)]),
                pairs1 : _.shuffle(pairs),
                triplets1 : _.sampleSize(triplets, 16),
                quads1 : _.sampleSize(quads, 16)
            }

            return _.concat(block.primitives, block.pairs1, block.triplets1, block.quads1)
        }

        // call newBlock 4 times for a curriculum of... 4 
        let trials;
        if (numBlocks == 4){
            trials = [...newBlock(), ...newBlock(), ...newBlock(), ...newBlock()]
        } else {
            trials = [...newBlock(), ...newBlock()]
        }
        
        /*
            In the binding energy version of the study, we're not generating levels procedurally, so we don't need to pass
            the data into getRound(), we've already generated the function sequences and can just create configs straight away
        */
        let allRounds = []
        trials.forEach(trialSequence => {
            allRounds.push(computeScore(trialSequence))
        })

        return allRounds

    }
}

function computeScore(sequence){
    /* From a given sequence of concepts, as ["A"], ["A", "B"] etc. made of a max set ["A", "B", "C", "D"],
        generate a valid start and end point from the latent functions defined in local var `mapping`
    */
    const mapping = {
        A : function(score){return score + 1},
        B: function(score){return score * (-1)},
        C: function(score){return score * 2},
        D: function(score){return start}
    }
    
    // Check if target score is allowed (i.e. in bounds)
    const check = (score, sequence) => {
        sequence.forEach(func => {
            score = mapping[func](score)
        })
        if (score >= -10 & score <= 10){
            return score
        }
        else {
            return undefined
        }
    }

    // Randomly choose start score and check if allowed - if not regenerate until allowed
    let start = _.sample(_.range(-10, 10))
    let target = check(start, sequence)

    while (target == undefined){
        start = _.sample(_.range(-10, 10))
        target = check(start, sequence)
    }

    // Return the function mappings as ['A', 'B', etc.] and start/target scores
    return {
        functions : sequence,
        start: start, 
        target: target,
        score : start,
    }
}

























