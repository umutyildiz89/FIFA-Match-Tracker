/**
 * Text Parsing Test
 * OCR'dan gelen text'i parse edip match data'sına çevirir
 */

import { parseMatchData } from './utils/textParser.js';

// Test text'leri
const testTexts = [
  {
    name: 'Clubs Match',
    text: `
FIFA CLUBS
Real Madrid 2 - 1 Barcelona
Player 1
Player 2
Player 3
Messi
Ronaldo
    `
  },
  {
    name: 'Ultimate Team Match',
    text: `
ULTIMATE TEAM
Chelsea 3 - 2 Arsenal
Score: 3-2
Players:
Haaland
Mbappe
Kane
    `
  },
  {
    name: 'Seasons Match',
    text: `
FIFA SEASONS
Manchester United 1 - 0 Liverpool
MU Player 1
MU Player 2
LFC Player 1
    `
  }
];

console.log('=== Text Parsing Test ===\n');

testTexts.forEach((test, index) => {
  console.log(`\n--- Test ${index + 1}: ${test.name} ---`);
  console.log('Input Text:');
  console.log(test.text);
  console.log('\nParsed Result:');
  
  const extractedText = {
    text: test.text,
    confidence: 85.0,
    lines: test.text.split('\n').filter(line => line.trim().length > 0)
  };
  
  const matchData = parseMatchData(extractedText);
  console.log(JSON.stringify(matchData, null, 2));
  console.log('\n---');
});

console.log('\n✅ Text Parsing Test Tamamlandı!');

