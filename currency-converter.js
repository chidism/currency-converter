"use strict";
 
   window.onload = () => { 

         //checking to see if service worker exist in the clients browser
                if('serviceWorker' in navigator){
                   navigator.serviceWorker.register('serviceWorker.js')
                    .then(function(response){
                        console.log('service worker registered successfully');
                    }, function(error){
                        console.log('service worker registration failed',error)
                    })
                }

          // }

            let select_box = document.getElementById('currency-selector');
            select_box.length = 0;

            //select 2
            let select_box2 = document.getElementById('currency-selector2');
            select_box2.length = 0;

            fetch('https://free.currencyconverterapi.com/api/v5/countries', {mode: 'cors'})
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log('Error connecting to API. Status Code: ' +
                        response.status);
                        
                        //fetch from indexDB
                        let data = getAllCurrencies();
                        setData(data); //offline data
                    }

                    if (response.status == 200) {

                        response.json().then(function(responseData) {
                            setData(responseData);
                        })
                    }

                //response.json().then(function(data) {
                    // let option;  let option2;
                    // for (i in data.results) {
                    //     const name = data.results[i].currencyName;
                    //     const symbol = data.results[i].currencySymbol;
                    //     option = document.createElement('option');
                    //     //option.text = data.results[i].currencyName + ' - ' + data.results[i].currencySymbol;
                    //     option.text = `${name} ${symbol}`;
                    //     option.value = data.results[i].currencyId;
                    //     select_box.add(option);

                    //     option2 = document.createElement('option');
                    //     option2.text = data.results[i].currencyId;
                    //     option2.value = data.results[i].currencyId;
                    //     select_box2.add(option2);
                    //     select_box2.add(option2);

                      
                    // }
                //});
                }
            )
            .catch(function(err) {
                console.log('Fetch Error: ', err);
            });
        function setData(data){
            let option;  let option2;
            for (let i in data.results) {
                const name = data.results[i].currencyName;
                const symbol = data.results[i].currencySymbol;
                option = document.createElement('option');
                //option.text = data.results[i].currencyName + ' - ' + data.results[i].currencySymbol;
                option.text = `${name} ${symbol}`;
                option.value = data.results[i].currencyId;
                select_box.add(option);

                option2 = document.createElement('option');
                option2.text = data.results[i].currencyId;
                option2.value = data.results[i].currencyId;
                select_box2.add(option2);
                select_box2.add(option2);

              
            }
        }
        function convert_currency(){
            let currency1 = document.getElementById('currency-selector').value;
            let currency2 = document.getElementById('currency-selector2').value;
            let amount = document.getElementById('amount').value;
            let convert = currency1+'_'+currency2;
            
            fetch('https://free.currencyconverterapi.com/api/v5/convert?q='+convert+'&compact=ultra', {mode: 'cors'})
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log('Error connecting to API. Status Code: ' +
                        response.status);
                        return;
                    }

                // Examine the text in the response
                response.json().then(function(data) {
                        const rate = data[convert];
                        console.log(rate);
                    document.getElementById('result').innerHTML = (amount * rate).toFixed(2);
                    });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error: ', err);
            });

        }


//DB functions and others
// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Open (or create) the database
let dbConnect = indexedDB.open("CurrencyDatabase", 1);

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

    //setCurrencyData
    //setAllCurrencies();
    fetch('https://free.currencyconverterapi.com/api/v5/countries', {mode: 'cors'})
    .then(
        function(response) {
            if (response.status == 200) {
                response.json().then(function(data) {
                    // for(item in data.resuslts){
                    //     console.log(data.results[item].currencyName)
                    //     // const item = {
                    //     //   currencyname: '',
                    //     //   currencyID: '',
                    //     // };
                    //     store.add(item);
                    // }
                    addDataToDB(data)
                })
            }
        }
    )
    // Close the db after transaction is done
    transaction.oncomplete = function() {
        db.close();
    };
}
function addDataToDB(data){
    //console.log("items");
    dbConnect.onsuccess = function() {
        // Start a new transaction
       // console.log(dbConnect.result)
        const db = dbConnect.result;
        const transaction = db.transaction("CurrencyStore", "readwrite");
        const currencyStore = transaction.objectStore("CurrencyStore");
        //var index = store.index("CurrencyIndex");
        
        for(let item in data.resuslts){
            // const item = {
            //   currencyname: '',
            //   currencyID: '',
            // };
            currencyStore.add(item);
           
        }
        
        // Close the db after transaction is done
        transaction.oncomplete = function() {
            db.close();
        };
    }
    
}


//add
function setAllCurrencies(db){
    fetch('https://free.currencyconverterapi.com/api/v5/countries', {mode: 'cors'})
    .then(
        function(response) {
            console.log("ttt")
            if (response.status == 200) {
                response.json().then(function(data) {
                    console.log("2ttt")
                    let transaction = db.transaction("CurrencyStore", 'readwrite');
                    const store = transaction.objectStore("CurrencyStore");
                    for(let item in data.resuslts){
                        // const item = {
                        //   currencyname: '',
                        //   currencyID: '',
                        // };
                        store.add(item);
                        console.log("3ttt")
                    }
                    
                })
            }
        }
    )
}

//getAll
function getAllCurrencies(){
    //console.log("items");
    dbConnect.onsuccess = function() {
        // Start a new transaction
       // console.log(dbConnect.result)
        const db = dbConnect.result;
        const transaction = db.transaction("CurrencyStore", "readwrite");
        const currencyStore = transaction.objectStore("CurrencyStore");
        //var index = store.index("CurrencyIndex");
    
        //getAllCurrency
        return currencyStore.getAll();
        
        // Close the db after transaction is done
        transaction.oncomplete = function() {
            db.close();
        };
    }
    
}


}