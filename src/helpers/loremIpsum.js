const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4,
    },
    wordsPerSentence: {
        max: 16,
        min: 4,
    },
});

const generateSentences = (number) => {
    return lorem.generateSentences(number);
};

const generateWords = (number) => {
    return lorem.generateWords(number);
};

module.exports = [generateSentences, generateWords];
