import React, { useContext, useCallback, useEffect } from 'react'
import {InjectedConnector, NoEthereumProviderError, UserRejectedRequestError} from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import {ChainId, SCAN_ADDRESS} from '../web3/address'
import { message } from 'antd'
import { mainContext } from '../reducer'
import {UnsupportedChainIdError, useWeb3React} from "@web3-react/core";

export const POLLING_INTERVAL = 12000

export const injected = new InjectedConnector({
  //supportedChainIds: [ChainId.BSC_TESTNET, ChainId.BSC],
  supportedChainIds: [1, 3, 4, 5, 42, 56, 88, 89, 97, 137, 1337, 80001],

})


const bscWalletConnector = new WalletConnectConnector({
  rpc: { 56: 'https://bsc-dataseed.binance.org/' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const walletConnector = {
  [ChainId.BSC]: bscWalletConnector,
}

const bscNetwork =  {
  chainId: '0x38',
  chainName: 'BSC',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: [SCAN_ADDRESS[ChainId.BSC]],
}

const hecoNetwork = {
  chainId: '0x80',
  chainName: 'HECO',
  nativeCurrency: {
    name: 'HT',
    symbol: 'HT',
    decimals: 18,
  },
  rpcUrls: [
    'https://http-mainnet-node.huobichain.com',
  ],
  blockExplorerUrls: [SCAN_ADDRESS[ChainId.HECO]],
}

const networkConf = {
  [ChainId.BSC]: bscNetwork,
}

export const changeNetwork = (chainId) => {
  return new Promise(reslove => {
    const { ethereum } = window 
    if (ethereum && (ethereum.isMetaMask || ethereum.isCoin98) && networkConf[chainId]) {
      ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...networkConf[chainId],
            },
          ],
        })
        .then(() => {
          setTimeout(reslove, 500)
        })
    } else {
      reslove()
    }
  })
}

export function getScanLink(chainId, data, type) {
  const prefix = SCAN_ADDRESS[chainId]
  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export const useConnectWallet = () => {
  const {activate, deactivate, active} = useWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const connectWallet = useCallback((connector, chainId, walletFlag = '') => {
    return changeNetwork(chainId).then(() => {
      return new Promise((reslove, reject) => {
        activate(connector, undefined, true)
          .then((e) => {
            if (
              walletFlag &&
              walletFlag === 'coin98' &&
              !(window.ethereum.isCoin98 || window.coin98)
            ) {
              message.error(
                state.locale === 'zh'
                  ? ''
                  : 'Please Install Coin98 Wallet From Chrome WebStore'
              )
            }
            if (window.ethereum && window.ethereum.on) {
                window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                  deactivate()
                }
              })

              window.ethereum.on('disconnect', () => {
                deactivate()
              })

              window.ethereum.on('close', () => {
                deactivate()
              })

              window.ethereum.on('message', (e) => {
                console.log('message', e)
              })
            }
            reslove(e)
          })
          .catch((error) => {
            switch (true) {
              case error instanceof UnsupportedChainIdError:
                break
              case error instanceof NoEthereumProviderError:
                break
              case error instanceof UserRejectedRequestError:
                break
              default:
                console.log(error)
            }
            reslove(error)
          })
      })
    })
  }, [])

  useEffect(() => {
    // !active && connectWallet(injected)
    // window.ethereum && window.ethereum.on('networkChanged', () => {
    //   !active && connectWallet(injected)
    // })
  }, [])
  return connectWallet
}