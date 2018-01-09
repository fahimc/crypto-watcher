const Coinmarketcap = require('./service/coinmarketcap.js');
const db = require('./service/dball.js');

const CryptoBot = {
    CHECK_DELAY: 60,
    PERCENTAGE_CHANGE_DURATION: 180,
    init() {
        db.init();
        console.log('Started CryptoBot');
        Coinmarketcap.getAllMartkets();
        this.checkPercentageChange();
    },
    checkPercentageChange() {
        let coins = db.getAllCoins()
        let count = this.PERCENTAGE_CHANGE_DURATION / this.CHECK_DELAY;
        coins.forEach((coin) => {
            let hourPercentageChangeCollection = [];
            for (let a = 0; a < coin.history.length; ++a) {
                if (a >= count) break;
                let history = coin.history[a];
                hourPercentageChangeCollection.push(history.percent_change_1h);
            }
            let averagePercentageChange = this.getAverageFromArray(hourPercentageChangeCollection);
            db.addPercentageChange({
                name: coin.name,
                symbol: coin.symbol,
                change: {
                    averageChange: averagePercentageChange,
                    usdPrice: coin.history[0].price_usd,
                    btcPrice: coin.history[0].price_btc,
                    volume: coin.history[0]['24h_volume_usd'],
                    datetime: this.getFormattedDate()
                }
            });
            if(averagePercentageChange > 1)console.log(coin.symbol, averagePercentageChange);
        });
        
        this.next();
    },
    next(){
      setTimeout(this.checkPercentageChange.bind(this),this.CHECK_DELAY * 1000);
    },
    getFormattedDate() {
        var date = new Date();
        var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return str;
    },
    getAverageFromArray(arr) {
        return arr.reduce((p, c) => Number(p) + Number(c), 0) / arr.length;
    }
};

CryptoBot.init();