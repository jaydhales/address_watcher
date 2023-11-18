import { JsonRpcProvider, ethers } from 'ethers';
import { ethersProvider, rpc } from '../config/walletconfig';
import { getContract } from 'viem';
import { publicProvider } from 'wagmi/dist/providers/public';

export const decodeContract = async (address: string) => {
  const abi = await ethersProvider.getContract(address);
  console.log(abi);

  const contract = abi?.connect(new JsonRpcProvider(rpc));

  try {
    const [name, symbol, decimals] = await Promise.all([
      contract?.name(),
      contract?.symbol(),
      contract?.decimals(),
    ]);

    return {
      type: 'ERC20',
      name,
      symbol,
      decimals,
      img: `https://etherscan.io/token/images/${symbol.toLowerCase()}_28.png`,
    };
  } catch (error) {
    console.log('Not a valid ERC20 token', error);
  }

  try {
    const [name, symbol, tokenUri] = await Promise.all([
      contract?.name(),
      contract?.symbol(),
      contract?.tokenURI(1), // sample tokenId, replace with actual tokenId if available
    ]);

    return { type: 'ERC721', name, symbol, tokenUri };
  } catch (error) {
    console.log('Not a valid ERC721 token', error);
    return { type: 'UNKNOWN' };
  }
};
