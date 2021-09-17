import React, { useContext, useEffect } from 'react'
import { WalletConnect } from '../components/account/WalletConnect'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { mainContext } from '../reducer'

import {
  HANDLE_WALLET_MODAL,
} from '../const'

import {
  WalletModal,
  FailedTransactionModal,
  WaitingWalletConfirmModal,
  TransactionModal,
  SuccessTransactionModal,
} from '../components/Modals'

import {StakePopup} from '../components/staking/StakePopup.js'
import {UnStakePopup} from '../components/staking/UnStakePopup.js'


import { useConnectWallet } from '../connectors'

export const InitPage = () => {
  const { dispatch, state } = useContext(mainContext)

  const context = useWeb3React()
  //const connectWallet = useConnectWallet()
  const { activate } = context

  const {
    showFailedTransactionModal,
    showWaitingWalletConfirmModal,
    showTransactionModal,
    walletModal,
    showSuccessTransactionModal,
  } = state

  console.log(state, 'state')
 
  return (
    <>
      {walletModal === 'connect' && (
        <div className='modal-show'>
          <div className='wrapper'>
            <WalletConnect
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
            />
          </div>
        </div>
      )}
      {walletModal === 'change' && (
        <div className='modal-show'>
          <div className='wrapper'>
            <WalletConnect
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
            />
          </div>
        </div>
      )}
      {walletModal === 'status' && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <WalletModal
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: 'change',
                })
              }
            />
          </div>
        </div>
      )}
      {walletModal === 'change' && (
        <div className='modal-show'>
          <div className='wrapper'>
            <WalletConnect
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
            />
          </div>
        </div>
      )}
      {(walletModal === 'deposit') && (
        <div className='modal-show'>
          <div className='wrapper' >
            <StakePopup
              //pool={pool}
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() => {}}
            />
          </div>
        </div>
      )}
       {(walletModal === 'withdraw') && (
        <div className='modal-show'>
          <div className='wrapper' >
            <UnStakePopup
              //pool={pool}
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() => {}}
            />
          </div>
        </div>
      )}
      {showWaitingWalletConfirmModal && showWaitingWalletConfirmModal.show && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <WaitingWalletConfirmModal />
          </div>
        </div>
      )}
      {showTransactionModal && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <TransactionModal />
          </div>
        </div>
      )}
      {showSuccessTransactionModal && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <SuccessTransactionModal />
          </div>
        </div>
      )}
     {showFailedTransactionModal && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <FailedTransactionModal />
          </div>
        </div>
      )}
    </>
  )
}