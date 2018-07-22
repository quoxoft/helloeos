
const CONTRACT_NAME = 'helloeos'
const NETWORK = 'http://127.0.0.1:8888'

Eos = require('eosjs')

updateTableRows()

function getEos() {
    var privateKey = document.getElementById('private_key').value;
        var config = {
            keyProvider: [privateKey],
            httpEndpoint: NETWORK,
            broadcast: true,
            sign: true,
            chainId: null,
            expireInSeconds: 60
        }
        return Eos(config);
}

window.writeMessage = function() {
    var eos = getEos();
    var accountName = document.getElementById('eos_account').value;
    var user_message = document.getElementById('eos_message').value;

    eos.contract(CONTRACT_NAME).then((contract) => {
        contract.writemessage(accountName, user_message, { authorization: accountName })
        .then((res) => {
            $("#msg-success").html("The action do succesfully")
            console.log(res)
        })
        .catch((err) => {
            $("#msg-warning").html(err.message);
            console.log(err)
        })
    })
}

window.removeMessage = function() {
    var eos = getEos();
    var accountName = document.getElementById('eos_account').value;

    eos.contract(CONTRACT_NAME).then((contract) => {
        contract.rmmessage(accountName, { authorization: accountName })
        .then((res) => {
            $("#msg-success").html("The action do succesfully")
            console.log(res)
        })
        .catch((err) => {
            $("#msg-warning").html(err.message);
            console.log(err)
        })
    })
}


function updateTableRows(){
    var eos = getEos();
    var params = {
        json: true,
        scope: CONTRACT_NAME,
        code: CONTRACT_NAME,
        table: "usernames", 
        limit: 10
    }
    var tbody = document.querySelector("#block_messages tbody");
    tbody.innerHTML = '';
    return eos.getTableRows(params).then(resp => {
        var sorted = resp.rows.sort() ;
        sorted.map((account, i) => `<tr class="prod-row">
            <td>${account.owner}</td>
            <td>${account.message}</td>
        </tr>`)
        .forEach(row => tbody.innerHTML += row);
    });
}
  