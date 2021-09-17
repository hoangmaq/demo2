import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import cs from 'classnames'
//import BigNumber from 'bignumber.js'
import { getContract,useActiveWeb3React } from '../../web3'
import {HANDLE_WALLET_MODAL, 
  NOT_ACCESS_MODAL,
  HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
  HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_TRANSACTION_MODAL,
  waitingForInit,
  waitingPending
} from '../../const'
import {
  TITANS_STAKING_ADDRESS,
  TITANS_ADDRESS
} from '../../web3/address'
import { mainContext } from '../../reducer'
import { changeNetwork } from '../../connectors'
import { Button, message } from 'antd'
import { formatAmount, splitFormat } from '../../utils/format'
import {useStakingInfo} from '../../pages/stake/Hooks'
import { useAllowance, useBalance } from '../../pages/Hooks'
import TITANS_LOGO  from '../../assets/icon/titans.png'
import TitanStaking from '../../contract/titanStakeABI.json'
import TitanToken from '../../contract/titanTokenABI.json'
import { ChainId } from '../../web3/address'
import {formatEther,parseUnits} from "@ethersproject/units";
import { MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";
//import stakePopup from './stakePopup'

import fram from '../../assets/icon/Frame.png'


const StakeCard = (props) => {

  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)
  const farmPools = useStakingInfo()
  const {allowance} = useAllowance()

  //const [amount, setAmount] = useState()
  //const [isApproved, setIsApproved] = useState(false)
  //const [isStaked,setIsStaked] = useState(false)
  //const [tabFlag, setTabFlag] = useState()
  const isValidChainID = active && (chainId == ChainId.BSC || chainId == ChainId.BSC_TESTNET); 

  const isApproved = isValidChainID && allowance && BigNumber.from(allowance).gt(0)
  const isStaked = isValidChainID && farmPools && farmPools.staked > 0
  //if (farmPools.staked > 0) setIsStaked(true);
  //allowance && BigNumber.from(allowance).lte(0) ? setIsApproved(false) : setIsApproved(true);
  const onHarvest = (e) => {
    if (!active) {
      return false
    }
    const contract = getContract(library, TitanStaking, TITANS_STAKING_ADDRESS)
    contract.methods
      .harvest()
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
        //onClose()
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
    const onApprove = (e) => {
        if (!active) {
          return false
        }
        const contract = getContract(library, TitanToken, TITANS_ADDRESS)
        contract.methods
          .approve(TITANS_STAKING_ADDRESS,'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
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
            //setIsApproved(1)
            dispatch({
              type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
              showWaitingWalletConfirmModal: waitingForInit,
            })
            dispatch({
              type: HANDLE_SHOW_TRANSACTION_MODAL,
              showTransactionModal: true,
            })
            //onClose()
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
    <div>
      <img src={fram} className='farm_index_img'></img>
      <div className ="farm_index_headline">
        <div  className="farm_index_headline_text">
          Deposit TITANS To Earn $TITANS Rewards
        </div>
      </div>
      <div className='farm_tier_box'>
        <div className='farm_box'>
        <div className={`farm_index`}>
        <div className='farm_index_card'>
        <div className='farm_index_card_title'>
          STAKE TITANS
          {/* <img src={TITANS_LOGO} /> */}
        </div>
        <div className='farm_index_card_box'>
            <div className='farm_index_arp_liq_box'>
              <div className='farm_index_card_value'>
                <div className='farm_index_card_arp1'> APR </div>
                <div className='farm_index_card_arp2'> 10% </div>
              </div>
              <div className='farm_index_card_value'>
                <div className='farm_index_card_lq1'> Total Rewards </div>
                <div className='farm_index_card_lq2'> {formatAmount(isValidChainID && farmPools? farmPools.totalRewards : 0.0)} TITANS </div>
              </div>
            </div>
            <div className='farm_index_reward_box'>
              <div className='farm_index_reward_sub_box'>
                <div className='farm_index_reward_text'>Reward Earned</div>
                <div className='farm_index_reward_value'>{formatAmount(isValidChainID && farmPools? farmPools.earned : 0.0)} </div>
              </div>
              <div>   
                  <button className={isApproved? 'farm_index_rward_btn_wapproved' : 'farm_index_reward_btn'}
                  disabled={!isValidChainID} //|| (farmPools && farmPools.earned == 0)
                  onClick={onHarvest}

                  >Harvest</button>
              </div>
            </div>
            <div className={isApproved? 'farm_index_stake_box_wapproved':'farm_index_stake_box'}>
              <div className={isApproved? 'farm_index_stake_sub_box_wapproved' : 'farm_index_stake_sub_box'}>
                  <div className='farm_index_stake_text'>Amount Titans Staked</div>
                  <div className='farm_index_reward_value'> 
                    {formatAmount(isValidChainID && farmPools ? farmPools.staked : 0.0)}
                  </div>              
              </div>
              {isApproved &&
                    <div className='farm_index_stake_unstake_box'>
                      <button className={isStaked ? 'farm_index_deposit_btn_staked': 'farm_index_deposit_btn'}
                        onClick = { ()=>
                            dispatch({
                            type: HANDLE_WALLET_MODAL,
                            walletModal: 'deposit',
                          })
                        }
                      > 
                      Stake
                      </button>
                    {isStaked && 
                      <button className='farm_index_withdraw_btn'
                      // disabled = {!isStaked}
                      onClick = { ()=>
                        dispatch({
                        type: HANDLE_WALLET_MODAL,
                        walletModal: 'withdraw',
                      })
                    }
                      > 
                        Unstake
                      </button>
                    } 
                    </div>
                  }
              </div>
          </div>
          {
            !isApproved && 
              <div className='farm_index_approve_box'>   
             
              <button className='farm_index_approve_btn' disabled={!isValidChainID}
                onClick={onApprove}
              >Approve</button>
             </div> 
          }
       
        </div>
        </div>
        </div>
        {/* <hr claseName='hr_farm'/> */}
      </div>
      
    </div>
  )
}

export default injectIntl((props) => {
  const { dispatch, state } = useContext(mainContext)
  return useMemo(() => <StakeCard {...props} dispatch={dispatch} />, [dispatch, props])
})