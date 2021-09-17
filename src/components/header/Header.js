
import React, { useContext, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../web3'
import { GET_TITANS_ADDRESS, ChainId } from '../../web3/address'
import LogoText from '../../assets/logo/logo2.png'
import { formatAddress, formatAmount } from '../../utils/format'
import { mainContext } from '../../reducer'
import { HANDLE_WALLET_MODAL} from '../../const'
import account_balance_wallet from '../../assets/icon/account_balance_wallet.png'
import { useBalance } from '../../pages/Hooks'
import { FormattedMessage } from 'react-intl'

export const Header = () => {
  const { active, account, chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const { balance } = useBalance(GET_TITANS_ADDRESS(chainId), chainId)

  return (
    <header
      className='header'
      style={{ borderBottom: 'transparent' }}
    >
      <div className='center'>
        <div className='header__box'>
          <div>
              <img
                className='header__logo'
                src={LogoText}
              />
          </div>
            {active && (
              <div className='account-connected'
                // onClick={() => {
                //   dispatch({
                //     type: HANDLE_WALLET_MODAL,
                //     walletModal: 'status',
                //   })
                // }}
              >
                {/* <p>{parseFloat(formatAmount(balance)).toPrecision(4)} TITANS</p> */}
                {chainId == ChainId.BSC ? 'BSC' : chainId == ChainId.BSC_TESTNET ? 'BSC_TN' : 'Wrong Network!'}
              </div>
            )}
            {active && (
              <div className='account'>
                <div
                  className='address'
                  onClick={() => {
                    dispatch({
                      type: HANDLE_WALLET_MODAL,
                      walletModal: 'status',
                    })
                  }}
                >
                  {formatAddress(account)}
                </div>
              </div>
            )}
            {!active && (
              <div className='header__btn'>
                <button className='connect-btn'>
                  <span className='buttonContainer'
                    onClick={() => {
                      dispatch({
                        type: HANDLE_WALLET_MODAL,
                        walletModal: 'connect',
                      })
                    }}
                  >
                   <FormattedMessage  id='linkWallet' />

                  </span>
                  <img src={account_balance_wallet} />
                </button>
              </div>
            )}
          </div>
      </div>
    </header>
  )
}