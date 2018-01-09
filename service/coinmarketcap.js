const getJSON = require('get-json');
const db = require('./dball.js');
const CoinMarketCap = {
    marketData: {},
    getAllMartkets() {
        getJSON('https://api.coinmarketcap.com/v1/ticker/', function(error, response) {
            /*
            { id: 'bitcoin',
  }
  name: 'Bitcoin',
  symbol: 'BTC',
  rank: '1',
  price_usd: '14676.3',
  price_btc: '1.0',
  '24h_volume_usd': '16178100000.0',
  market_cap_usd: '246451400842',
  available_supply: '16792475.0',
  total_supply: '16792475.0',
  max_supply: '21000000.0',
  percent_change_1h: '-1.62',
  percent_change_24h: '-3.1',
  percent_change_7d: '-1.25',
  last_updated: '1515536060' }
  */
            db.addAllSymbols(response);

        });
    },
    onAllMarketsComplete(error, response){
      this.marketData
    }
};

module.exports = CoinMarketCap;