export const ChainId = {
  BSC: 56,
  BSC_TESTNET: 97
}
export const SCAN_ADDRESS = {
    [ChainId.BSC]: 'https://bscscan.com',
    [ChainId.BSC_TESTNET]: 'https://testnet.bscscan.com/'
  }

export const ADDRESS_0 = '0x0000000000000000000000000000000000000000'

export const TITANS_STAKING_ADDRESS = '0x2eC03E93b4b651441535C3187E24938446bc9aAE'
export const TITANS_ADDRESS = '0xe69dcb1c6c7c210319f86a13fcf753ab2a3ad62e'

export function GET_TITANS_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
    case ChainId.BSC_TESTNET:
      return '0xE69DcB1c6C7c210319f86A13Fcf753ab2a3Ad62e'
    default:
      return '0xE69DcB1c6C7c210319f86A13Fcf753ab2a3Ad62e'
  }
}

export function GET_TITANS_STAKING_ADDRESS(chainId) {
    switch (chainId) {
      case ChainId.BSC:
        return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
      case ChainId.BSC_TESTNET:
        return '0x2eC03E93b4b651441535C3187E24938446bc9aAE'
      default:
        return '0x2eC03E93b4b651441535C3187E24938446bc9aAE'
    }
  }

export function BNB_ADDRESS(chainId) {
    switch (chainId) {
      case ChainId.BSC:
        return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
      case ChainId.BSC_TESTNET:
        return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
      default:
        return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
    }
  }

export function RPC_URLS (chainId) {
    return {
      [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
      [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s1.binance.org:8545/'
    }[chainId]
}