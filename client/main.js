let GCBank;
let GCR;

window.addEventListener('load', async () => {

    if (Boolean(window.ethereum) == true){

        ethereum.autoRefreshOnNetworkChange = false;

        window.accounts = [];
        const biconomy = new Biconomy(window.ethereum,{apiKey: "aKBJCRz5_.e87303f2-d762-4e5e-9877-0003f38cea08"});
        window.web3 = new ethers.providers.Web3Provider(biconomy);
        //window.web3 = new ethers.providers.Web3Provider(ethereum);

        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setupContracts(accounts)
    }
    else if (window.web3){
        let accounts = await web3.currentProvider.enable()
        setupContracts(accounts)
    }
    else {
        console.log('Get web3');
    }

});

async function setupContracts(accounts){
    GCBank = new ethers.Contract(GCBank_address, GCBank_ABI, web3.getSigner());
	GCR = new ethers.Contract(GCR_address, GCR_ABI, web3.getSigner());
    window.accounts = accounts;

	let gcrbal = await GCR.balanceOf(accounts[0]);
	document.getElementById('bal').innerText = `${parseInt(gcrbal)/1000} $GCR`
	gcrbal = await GCR.balanceOf(GCBank.address);
	document.getElementById('bal_bank').innerText = `${parseInt(gcrbal)/1000} $GCR`
}

async function signAndSend(){
    const userNonce = await GCBank.nonces(accounts[0]);
	const transferAmount = parseInt(document.getElementById('points').value)*1000;

	const typedMessage = JSON.stringify({
		domain:{
			name: "GCBank",
			version: "1",
			chainId : "3",
			verifyingContract: GCBank_address
		},
		primaryType: "MetaTransaction",
		types: {
			EIP712Domain: [
				{ name: "name", type: "string" },
				{ name: "version", type: "string" },
				{ name: "chainId", type: "uint256" },
				{ name: "verifyingContract", type: "address" }
			],
			MetaTransaction: [
				{ name: "nonce", type: "uint256" },
				{ name: "from", type: "address" }
			]
		},
		message: {
			nonce: parseInt(userNonce),
			from: accounts[0]
		},
	});

	await web3.provider.sendAsync(
        {
			jsonrpc: "2.0",
           	id: 1,
           	method: "eth_signTypedData_v4",
           	params: [accounts[0], typedMessage]
        },
        async (err, result)=>{
            if (err) {
                return console.error(err);
            }
            const signature = result.result.substring(2);
            const r = "0x" + signature.substring(0, 64);
            const s = "0x" + signature.substring(64, 128);
            const v = parseInt(signature.substring(128, 130), 16);

			let data = await GCBank.withdrawPoints(
				transferAmount.toString(),
				accounts[0],
				r, s, v
			);

			console.log(data);

        }
    );

}


async function mint(){
    const abiCoder = ethers.utils.defaultAbiCoder;
    const data = abiCoder.encode([{type:"uint256"}], [
        document.getElementById('gcr_amt').value
    ]);
    const to = document.getElementById('gcr_receiver_add').value;
    await GCR.transfer(to, data);
}

// async function waitForTxToBeMined (txHash) {
//     let txReceipt
//     while (!txReceipt) {
//         try {
//             txReceipt = await window.web3.eth.getTransactionReceipt(txHash)
//         } catch (err) {
//         	updateStatus("failure: " + err);
//             return;
//         }
//     }
//     updateStatus("Success: transaction confirmed!");
// }
