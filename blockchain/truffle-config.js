module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gas: 6721975, // Increase if needed
      gasPrice: 20000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
    },
  },
};
