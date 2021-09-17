import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { Button } from 'antd'
import {useStakingInfo} from '../../pages/stake/Hooks'
import { useAllowance, useBalance } from '../../pages/Hooks'

import Web3 from 'web3'
import { HANDLE_WALLET_MODAL } from '../../const'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'

import TitanStaking from '../../contract/titanStakeABI.json'
import TitanToken from '../../contract/titanTokenABI.json'

import close from '../../assets/icon/close.png'
import getToken from '../../assets/icon/linkIconx2.png'

import { FormattedMessage } from 'react-intl'
import { useFarmInfo } from '../../pages/stake/Hooks'
import {
  HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_TRANSACTION_MODAL,
  HANDLE_SHOW_SUCCESS_TRANSACTION_MODAL,
  HANDLE_SHOW_APPROVE_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
  waitingForInit,
  waitingPending,
  RANDOM_NUMBER,
} from '../../const'
import {formatEther,parseUnits} from "@ethersproject/units";

import {
    TITANS_STAKING_ADDRESS,
    TITANS_ADDRESS
  } from '../../web3/address'

import { mainContext } from '../../reducer'
import BigNumber from 'bignumber.js'

export const StakePopup = (props) => {
  const { intl, icon, onClose } = props
  //const [farmPools, setFarmPools] = useState({})
  //var farmPools;
   const { account, active, library, chainId } = useActiveWeb3React()
   const { dispatch, state } = useContext(mainContext)
   const [approve, setApprove] = useState(true)
   const [amount, setAmount] = useState('0')
   const [fee, setFee] = useState(0)
   const [loadFlag, setLoadFlag] = useState(false)
   const [nowTime, setNowTime] = useState(parseInt(Date.now() / 1000))

   const { balance } = useBalance()
   const farmPools = useStakingInfo()
   const {allowance} = useAllowance()

   const getDate = () => {
    var current = new Date(); 
    var followingDay = new Date(current.getTime() + 10*86400000); // + 10 day in ms
    return followingDay.toLocaleDateString();
   }
   const [date,setDate] = useState(getDate());

   useEffect(() => {
    const interval = setInterval(() => { 
        var date = getDate();
        setDate(date)}
    , 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  
    const onDeposit = (e) => {
    if (!active) {
      return false
    }
    const contract = getContract(library, TitanStaking, TITANS_STAKING_ADDRESS)
    contract.methods
      .deposit(parseUnits(amount,'ether'))
      .send({
        from: account,
      })
      .on('transactionHash', (hash) => {
        dispatch({
          type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
          showWaitingWalletConfirmModal: { ...waitingPending, hash },
        })
      })
      .on('receipt', (_, receipt) => {
        console.log('BOT staking success')
        dispatch({
          type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
          showWaitingWalletConfirmModal: waitingForInit,
        })
        dispatch({
          type: HANDLE_SHOW_TRANSACTION_MODAL,
          showTransactionModal: true,
        })
        onClose()
      })
      .on('error', (err, receipt) => {
        console.log('BOT staking error', err)
        dispatch({
          type: HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
          showFailedTransactionModal: true,
        })
        dispatch({
          type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
          showWaitingWalletConfirmModal: waitingForInit,
        })
      })
    }
  return (
    // <div style={{ paddingTop: '30px' }}>
    <div className='modal'>
        <div className='modal__popup_box'>
            <div className='modal__popup_inner_box'>
                <div className='modal__popup_header'>
                    <div className='modal__popup_title'>
                        <p>Stake Tokens</p>
                    </div>
                    <div className='modal__popup_input'>
                        <div className='modal__popup_input_info'>
                            <p className='modal__popup_input_info_stake'>Stake</p>
                            <p className='modal__popup_input_info_bal'>Balance: {parseFloat(formatAmount(balance)).toPrecision(4)}</p>
                        </div>
                        <div className='modal__popup_input_text'>
                            <input className='modal__popup_input_text_input'
                             onChange={e => setAmount(e.target.value)}
                             value={amount}
                            >
                            </input>
                            <div className='modal__popup_input_text_btn_box'>
                                <button className='modal__popup_input_text_btn_box_btn'
                                onClick = {() => setAmount(formatAmount(balance))}
                                >
                                    MAX
                                </button>
                                <div className='modal__popup_input_text_btn_box_text'>
                                    TITANS
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='modal__popup_info'>
                        <div className='modal__popup_info_lock_duration'>
                            <div className='modal__popup_info_lock_duration_title'>
                                Lock Token For:
                            </div>
                            <div className='modal__popup_info_lock_duration_days'>
                                10 days
                            </div>
                        </div>
                        <div className='modal__popup_info_unlock'>
                            <div className='modal__popup_info_unlock_title'>
                                UnLock Date:
                            </div>
                            <div className='modal__popup_info_unlock_date'>
                                {date}
                            </div>
                        </div>
                    </div>
                    <div className='modal__popup_btn'>
                        <button className='modal__popup_btn_cancel'
                            onClick = {onClose}
                        >
                            Cancel
                        </button>
                        <button className='modal__popup_btn_confirm'
                            onClick = {onDeposit}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
                <div className='modal__popup_footer'>
                    <a className='modal__popup_footer_text'
                      target='_blank'
                      href={''}
                    >
                      Get Titan Tokens
                   </a>
                   <img className='modal__popup_footer_image' src={getToken}/>

                </div>
                <img
                    src={close}
                    alt=''
                    className='form-app__close-btn'
                    onClick={onClose}
                    aria-label='Close'
                />
            </div>
        </div>
    </div>
  )
}

//export default injectIntl(StakePopup)