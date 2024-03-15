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
    // Issue warning if no difficulty parameters are provided
    if (numConcepts == undefined || compDepth == undefined){
        console.log("[Warning]: Difficulty not defined in getRound()")
    }

    // Define function mappings
    const allConcepts = ['A', 'B', 'C', 'D']
    const mapping = {
        A : function(score){return score + 1},
        B: function(score){return score * (-1)},
        C: function(score){return score * 2},
        D: function(score){return 0}
    }

    // Get set of concepts to sample from
    let conceptSet = allConcepts.slice(0, numConcepts)
    let sequence = _.sampleSize(conceptSet, compDepth)

    // Function to check if target score is allowed (i.e. in bounds)
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
        startTime : Date.now(),
    }
}

function defineCurriculum(curriculumType){
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
            allRounds.push(getRound(level[0], level[1]))
        })

        return allRounds
    }
}