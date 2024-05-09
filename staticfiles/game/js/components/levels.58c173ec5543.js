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
            const primitives = ["D", "D", "D", "D"];
            const pairs = _.shuffle([
                ["A", "A"], ["A", "B"], ["A", "C"], ["A", "D"], 
                ["B", "A"], ["B", "B"], ["B", "C"], ["B", "D"], 
                ["C", "A"], ["C", "B"], ["C", "C"], ["C", "D"], 
                ["D", "A"], ["D", "B"], ["D", "C"], ["D", "D"]]);

            let block = {
                primitives: _.range(0, trialsPerBlock/2).map(i => [_.sample(primitives)]), // 32 primitives
                compositions1 : _.shuffle(pairs),
                compositions2 : _.shuffle(pairs)
            }

            return _.concat(block.primitives, block.compositions1, block.compositions2)
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

























