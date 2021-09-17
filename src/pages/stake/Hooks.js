import React, { useContext, useState, useEffect, useMemo } from 'react'
import { getContract, getLogs, useActiveWeb3React } from '../../web3'
import {
  ADDRESS_0,
  ChainId,
  RPC_URLS,
  BNB_ADDRESS,
  TITANS_STAKING_ADDRESS,
  TITANS_ADDRESS
} from '../../web3/address'
import StakingReward from '../../contract/titanStakeABI.json'
import Web3 from 'web3'
import { mainContext } from '../../reducer'

export function useBlockHeight() {
  const { state } = useContext(mainContext)
  return state.blockHeight
}

export const useStakingInfo = () => {
  const blockHeight = useBlockHeight()
  const { account,library,chainId } = useActiveWeb3React()
  const [owner, setOwner] = useState(0)
  const [earned, setEarned] = useState()
  const [staked, setStaked] = useState()
  const [depositTime, setDepositTime] = useState()
  const [totalRewards, setTotalRewards] = useState()
  const [stakeHolderList, setStakeHolderList] = useState()
  const [balance, setBalance] = useState() 
  function queryStakingInfo() {
    var web3 = new Web3(new Web3.providers.HttpProvider(RPC_URLS(chainId)))
    const contract = new web3.eth.Contract(
      StakingReward,
      TITANS_STAKING_ADDRESS,
      {from : account}
    )
    try {
      contract.methods
        .owner()
        .call()
        .then((res) => {
          setOwner(res)
          //console.log('Owner '+ res + ' ' + "Account " + account)
        })
    } catch (e) {
      console.log('Get Owner', e)
    }
    try {
      contract.methods
        .pendingTitan(account)
        .call()
        .then((res) => {
          setEarned(res)
        })
    } catch (e) {
      console.log('earned error', e)
    }

    try {
      contract.methods
        .userInfo(account)
        .call()
        .then((res) => {
          setStaked(res[0])
          setDepositTime(res[1])
          //console.log('Deposit Time'+ depositTime)
        })
    } catch (e) {
      console.log('getReward error', e)
    }
    try {
      contract.methods
        .totalStakingRewards()
        .call()
        .then((res) => {
          setTotalRewards(res)
        })
    } catch (e) {
      console.log('total rewards error', e)
    }
 
  }

  useEffect(() => {
    if (account) {
      queryStakingInfo()
    }
  }, [account,blockHeight])

  return earned && staked && depositTime && totalRewards && owner
    ? { earned, staked, depositTime, totalRewards, owner }
    : null
}

export const useHolderListInfo = () => {
  const blockHeight = useBlockHeight()
  const { account,library,chainId } = useActiveWeb3React()
  const [owner, setOwner] = useState(0)
  const [stakeHolderList, setStakeHolderList] = useState()
  function queryHolderListInfo() {
    var web3 = new Web3(new Web3.providers.HttpProvider(RPC_URLS(chainId)))
    const contract = new web3.eth.Contract(
      StakingReward,
      TITANS_STAKING_ADDRESS,
      {from : account}
    )
    //if(owner != 0 && account == owner) {
      try {
        //console.log(" Getting Holder list")
        contract.methods
          .getStakeHolderList()
          .call()
          .then((res) => {
            setStakeHolderList(res)
            //console.log(res[0])
            //console.log(res[1])
          })
      } catch (e) {
        console.log('total staking holder list', e)
      }
    //}
  }

  useEffect(() => {
    if (account) {
      queryHolderListInfo()
    }
  }, [account,blockHeight])

  return stakeHolderList  
    ? {stakeHolderList}
    : null
}
