// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Open (or create) the database
let dbConnect = indexedDB.open("CurrencyDatabase3", 1);

// Create the schema
dbConnect.onupgradeneeded = function() {
    let db = dbConnect.result;
    let store = db.createObjectStore("CurrencyStore", {keyPath: "id"});
    //var index = CurrencyStore.createIndex("CurrencyStoreIndex", ["currency.currencyId", "currency.id"]);
};


dbConnect.onsuccess = function() {
    // Start a new transaction
   // console.log(dbConnect.result)
    const db = dbConnect.result;
    const transaction = db.transaction("CurrencyStore", "readwrite");
    const store = transaction.objectStore("CurrencyStore");
    //var index = store.index("CurrencyIndex");
    
    //setData
    setAlldata();
    
    // Close the db after transaction is done
    transaction.oncomplete = function() {
        db.close();
    };
}

// //getAll
function getAllData(){
    //console.log("items");
    dbConnect.then(function(db) {
        const transaction = db.transaction("CurrencyStore", 'readonly');
        const store = transaction.objectStore("CurrencyStore");
        return store.getAll();
      }).then(function(items) {
        console.log(items);
    });
}

//add
function setAlldata(){
    fetch('https://free.currencyconverterapi.com/api/v5/countries', {mode: 'cors'})
    .then(
        function(response) {
            console.log("items");
            
            response.json().then(function(data) {
                dbConnect.then(function(db) {
                    let transaction = db.transaction("CurrencyStore", 'readwrite');
                    const store = transaction.objectStore("CurrencyStore");
                    for(item in data.resuslts){
                        // const item = {
                        //   currencyname: '',
                        //   currencyID: '',
                        // };
                        store.add(item);
                    }
                    return transaction.complete;
                  }).then(function() {
                    console.log('added currencies');
                });
            })
        }
    )
}

