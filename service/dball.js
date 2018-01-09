const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('data/db_all.json');
const db = low(adapter);

const DBManager = {
    init() {
        db.defaults({ coin: [], percentageChange:[] })
            .write()
    },
    addAllSymbols(collection) {
       collection.forEach((item)=>{
          this.addSymbol(item);
       });
    },
    addSymbol(coinData) {
        let row = db.get('coin').find({ symbol: coinData.symbol }).value();
        if (!row) {
            db.get('coin').push({ name: coinData.name, symbol: coinData.symbol, history:[coinData] }).write()
        } else {
          row.history.unshift(coinData);
          row.history = row.history.slice(0, 100);
          db.get('coin').find({ symbol: coinData.symbol }).assign(row).write();   
        }
    },
    addPercentageChange(coinData) {
        let row = db.get('percentageChange').find({ symbol: coinData.symbol }).value();
        if (!row) {
            db.get('percentageChange').push({ name: coinData.name, symbol: coinData.symbol, history:[coinData.change] }).write()
        } else {
          row.history.unshift(coinData.change);
          db.get('percentageChange').find({ symbol: coinData.symbol }).assign(row).write();   
        }
    },
    getAllCoins(){
      let row = db.get('coin').value();
      return row;
    }

};

module.exports = DBManager;