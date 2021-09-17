import React, { useContext, useEffect, useState } from 'react'
import { mainContext } from '../../reducer'
import { useActiveWeb3React } from '../../web3'
import { FormattedMessage } from 'react-intl'
import {
  GALLERY_SELECT_WEB3_CONTEXT,
  HANDLE_WALLET_MODAL,
} from '../../const'
import metamask from '../../assets/icon/metaMask.png'
//import Coin98 from '../../assets/icon/coin98@2x.png'
import close from '../../assets/icon/close.png'
import BSC from '../../assets/icon/BSC.png'
import walletConnect from '../../assets/icon/walletConnect.png'
import {changeNetwork, injected, useConnectWallet, walletConnector} from "../../connectors";
import {ChainId} from "../../web3/address";

export const WalletConnect = ({ onClose, onCancel }) => {
  const { dispatch, state } = useContext(mainContext)
  const { chainId } = useActiveWeb3React()
  const [connectedName, setConnectedName] = useState()
  const connectWallet = useConnectWallet()


  const initChainId = chainId || ChainId.BSC_TESTNET
  const [netWorkFlag, setNetWorkFlag] = useState(initChainId)


  useEffect(() => {
    const localContent =
      window && window.localStorage.getItem(GALLERY_SELECT_WEB3_CONTEXT)
    console.log('wallet content', localContent)
    if (localContent) {
      setConnectedName(localContent)
    }
  }, [])

  const selectNetWork = (_chainId) => {
    setNetWorkFlag(_chainId)
  }

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner transction-submitted link-wallet'>
            <div className='form-app__inner__header'>
              <FormattedMessage id='linkWallet' />
            </div>{' '}
            <div className='form-app__inner wallet-connect'>
              <div className='form-app__inner__wallets'>
                <div
                  onClick={() => {
                    connectWallet(injected, netWorkFlag).then(() => {
                      dispatch({
                        type: HANDLE_WALLET_MODAL,
                        walletModal: null,
                      })
                    })
                  }}
                  className='form-app__inner__wallets__item'
                >
                  <img src={metamask} />
                </div>
              </div>
            </div>
            <img
              src={close}
              alt=''
              className='form-app__close-btn'
              onClick={onClose}
              aria-label='Close'
            />
          </div>
        </form>
      </div>
    </div>
  )
}