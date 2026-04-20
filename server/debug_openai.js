const OpenAI = require('openai');
console.log('Type of OpenAI:', typeof OpenAI);
console.log('Keys of OpenAI:', Object.keys(OpenAI || {}));
if (OpenAI.OpenAI) {
  console.log('Type of OpenAI.OpenAI:', typeof OpenAI.OpenAI);
}
