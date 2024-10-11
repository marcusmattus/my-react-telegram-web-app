import { TonClient } from "ton";
import { useEffect, useState } from "react";

export function useTonClient() {
  const [client, setClient] = useState<TonClient | null>(null);

  useEffect(() => {
    const client = new TonClient({
      endpoint: "https://toncenter.com/api/v2/jsonRPC", // Use this for mainnet
      // endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC", // Use this for testnet
    });
    setClient(client);
  }, []);

  return client;
}
