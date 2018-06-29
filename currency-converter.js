        "use strict";
 
                window.onload = () => { 

                //checking to see if service worker exist in the clients browser
                if('serviceWorker' in navigator){
                   // try{
                    navigator.serviceWorker.register('/serviceWorker.js')
                    .then(function(response){
                        console.log('service worker registered successfully');
                    }, function(error){
                        console.log('service worker registration failed',error)
                    })
                    
                    // }catch(error){
                    //     console.log(error);
                    // console.log('service worker registration failed')
                    // }
                }

           }


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
                    return;
                }

                response.json().then(function(data) {
                    let option;  let option2;
                    for (i in data.results) {
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
                });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error: ', err);
            });

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