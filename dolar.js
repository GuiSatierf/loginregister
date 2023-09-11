// dolar

const url = 'https://economia.awesomeapi.com.br/last/'
const coins = 'USD-BRL,EUR-BRL'

fetch(url + coins)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        const dolarReal = data.USDBRL
        const euroReal = data.EURBRL

        let estaData = new Date(dolarReal.create_date)
        
        document.getElementById('title').innerHTML = dolarReal.name
        document.getElementById('thisdate').innerHTML = estaData.toLocaleString()
        document.getElementById('maxvalue').innerHTML = parseFloat(dolarReal.high).toLocaleString('pt-br',{
            style: 'currency',
            currency: 'BRL'
        })
        document.getElementById('minvalue').innerHTML = parseFloat(dolarReal.low).toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        }) 
    })

    // search bar

    function search(){
        let textToSearch = document.getElementById("text-to-search").value;
        let paragraph = document.getElementById("paragraph");
        textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    
        let pattern = new RegExp(`${textToSearch}`,"gi");
    
        paragraph.innerHTML = paragraph.textContent.replace(pattern, match => `<mark>${match}</mark>`)
    }