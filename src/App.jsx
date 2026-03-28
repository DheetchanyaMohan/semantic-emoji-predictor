import { useState, useEffect } from 'react'
import './App.css'
import { emojiKeywordIndex } from './data/emojiDatabase'
import { levenshtein } from './utils/levenshtein'
import { cosineSimilarity } from './utils/cosineSimilarity'

function App() {
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState(text);
  const [isTyping, setIsTyping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (text) setIsTyping(true);

    const timer = setTimeout(() => {
      setDebouncedText(text);
      setIsTyping(false);
    }, 300)

    return () => clearTimeout(timer);
  }, [text]);

  function stem(word) {
    if (word.endsWith("ing")) return word.slice(0, -3);
    if (word.endsWith("in")) return word.slice(0, -2);
    return word;
  }

  const words = debouncedText
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);

  let results = [];
  words.forEach(word => {
    const normalized = stem(word);

    if (normalized.length > 0) {
      emojiKeywordIndex.forEach((emojis, keyword) => {

        // KEYWORD MATCHING

        if (keyword === normalized) {
          emojis.forEach(e => results.push({ emoji: e, score: 1.0 }));
        }

        // PREFIX MATCHING

        else if (keyword.startsWith(normalized)) {
          emojis.forEach(e => results.push({ emoji: e, score: 0.8 })); // Add all elements of emojis array instead of adding the array itself (i.e. would create nested array)
        }

        // FUZZY MATCHING

        else if (normalized.length >= 4 && levenshtein(normalized, keyword) <= 1) {
          // check len > 4 to avoid running levenshtein calculation for every keyword
          emojis.forEach(e => results.push({ emoji: e, score: 0.5 }));
        }

        else if (normalized.length >= 4 && cosineSimilarity(normalized, keyword) >= 0.6) {
          emojis.forEach(e => results.push({ emoji: e, score: 0.4 }));
        }

      });
    }
  });

  // DEDUPLICATE

  const uniqueMap = new Map();

  results.forEach(({ emoji, score }) => {
    if (!uniqueMap.has(emoji) || uniqueMap.get(emoji) < score) {
      uniqueMap.set(emoji, score);
    }
  });

  results = Array.from(uniqueMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([emoji]) => emoji);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-blue-200 via-white to-purple-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        😄 Semantic Emoji Predictor
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Find relevant emojis using smart matching techniques like fuzzy search, prefix matching, and semantic similarity.
      </p>
      {/* <div className="bg-white px-6 py-6 rounded-2xl shadow-md flex flex-col items-center w-96 gap-4 min-h-[0px]"> */}
        <input type="text"
        placeholder='Type here...'
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setIsTyping(true);
          setIsCopied(false);
        }}
        className="w-80 px-4 py-3 textlg border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2 mt-2 flex-wrap justify-center">
        {["happy", "love", "sad", "party"].map((word) => (
          <button
            key={word}
            onClick={() => setText(word)}
            className="px-3 py-1 bg-blue-100 rounded-full text-sm hover:bg-gray-300 mt-3"
          >
            {word}
          </button>
        ))}
      </div>
        <p className="text-sm text-gray-500 p-5">
          {isTyping ? "Typing..." : ""}
        </p>
        <div className="grid grid-cols-5 gap-4 min-h-[40px]">
          {results.map((emoji, index) => (
            <span 
            key={index}
            onClick={() => {
              navigator.clipboard.writeText(emoji)
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 1000);
            }}
            className="text-3xl cursor-pointer transition-transform hover:scale-125"
            >{emoji}</span>
          ))}
        </div>
        {isCopied && (<p className="text-green-500 text-sm mt-5">Copied!</p>)}
      {/* </div> */}
    </div>
  );
}

export default App
