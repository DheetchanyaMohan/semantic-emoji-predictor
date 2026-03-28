export function cosineSimilarity(a, b) {
    const freqA = {};
    const freqB = {};

    for(let char of a){
        freqA[char] = (freqA[char] || 0) + 1;
    }

    for(let char of b){
        freqB[char] = (freqB[char] || 0) + 1;
    }

    let dot = 0;
    let magA = 0;
    let magB = 0;

    const allChars = new Set([...a, ...b]);

    allChars.forEach(char => {
        const x = freqA[char] || 0;
        const y = freqB[char] || 0;

        dot += x*y;
        magA += x*x;
        magB += y*y;
    });

    return dot/(Math.sqrt(magA)*Math.sqrt(magB) || 1);
}