module.exports = {
    waitFor: async (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    generateEmail: (i) => `${i}testemail.v.skyrtach@claps.com`,
  };