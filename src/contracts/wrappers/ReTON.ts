import {
    Contract,
    ContractProvider,
    Sender,
    Address,
    Cell,
    contractAddress,
    beginCell,
} from "ton-core";

export default class ReTON implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createForDeploy(code: Cell, initialBalance: bigint): ReTON {
        const data = beginCell()
            .storeUint(initialBalance, 64)
            .storeUint(0, 64) // totalRewards
            .storeUint(10, 8) // multiplier (1.0 stored as 10)
            .endCell();
        const workchain = 0;
        const address = contractAddress(workchain, { code, data });
        return new ReTON(address, { code, data });
    }

    async getBalance(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get("get_balance", []);
        return result.stack.readBigNumber();
    }

    async getTotalRewards(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get("get_total_rewards", []);
        return result.stack.readBigNumber();
    }

    async getMultiplier(provider: ContractProvider): Promise<number> {
        const result = await provider.get("get_multiplier", []);
        return result.stack.readNumber() / 10;
    }

    async sendTap(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.01", // Example transaction value
            body: beginCell().storeUint(1, 32).storeStringTail("tap").endCell(),
        });
    }

    async sendWithdraw(
        provider: ContractProvider,
        via: Sender,
        amount: bigint
    ) {
        await provider.internal(via, {
            value: "0.01", // Example transaction value
            body: beginCell()
                .storeUint(2, 32)
                .storeStringTail("withdraw")
                .storeUint(amount, 64)
                .endCell(),
        });
    }
}
