const EDIToken = artifacts.require("EDIToken");

contract('EDIToken', (accounts) => {
    it('should put 10000 EDIToken in the first account', async () => {
        const EDITokenInstance = await EDIToken.deployed();
        const balance = await EDITokenInstance.getBalance.call(accounts[0]);

        assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
    it('should call a function that depends on a linked library', async () => {
        const EDITokenInstance = await EDIToken.deployed();
        const EDITokenBalance = (await EDITokenInstance.getBalance.call(accounts[0])).toNumber();
        const EDITokenEthBalance = (await EDITokenInstance.getBalanceInEth.call(accounts[0])).toNumber();

        assert.equal(EDITokenEthBalance, 2 * EDITokenBalance, 'Library function returned unexpected function, linkage may be broken');
    });
    it('should send coin correctly', async () => {
        const EDITokenInstance = await EDIToken.deployed();

        // Setup 2 accounts.
        const accountOne = accounts[0];
        const accountTwo = accounts[1];

        // Get initial balances of first and second account.
        const accountOneStartingBalance = (await EDITokenInstance.getBalance.call(accountOne)).toNumber();
        const accountTwoStartingBalance = (await EDITokenInstance.getBalance.call(accountTwo)).toNumber();

        // Make transaction from first account to second.
        const amount = 10;
        await EDITokenInstance.sendCoin(accountTwo, amount, { from: accountOne });

        // Get balances of first and second account after the transactions.
        const accountOneEndingBalance = (await EDITokenInstance.getBalance.call(accountOne)).toNumber();
        const accountTwoEndingBalance = (await EDITokenInstance.getBalance.call(accountTwo)).toNumber();


        assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
        assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
    });
});