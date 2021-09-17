import { useState, useEffect } from 'react'
import { useBlockHeight, useFarmInfo } from './stake/Hooks'
import { getContract, getWeb3, useActiveWeb3React } from '../web3'
import {ChainId, RPC_URLS, TITANS_ADDRESS,TITANS_STAKING_ADDRESS} from '../web3/address'
import Web3 from "web3";
import TitanStaking from '../contract/titanStakeABI.json'
import TitanToken from '../contract/titanTokenABI.json'

const createContractERC20 = (chainId, address) => {

  var web3 = new Web3(new Web3.providers.HttpProvider(RPC_URLS(chainId)))
  return  new web3.eth.Contract(TitanToken, address)//TIANS_ADDRESS(chainId)

}

export const useBalance = (address, networkId=ChainId.BSC_TESTNET) => {
  const { account, active, library, chainId } = useActiveWeb3React()
  const [balance, setBalance] = useState(0)
  const blockHeight = useBlockHeight()
  // const pools = useFarmInfo()

  useEffect(() => {
    if (library && active) {
      try {
        if (address === '0x0') {
          const web3 = getWeb3(library)

          web3.eth.getBalance(account).then((balance) => {
            setBalance(balance)
          })
        } else {
          const contract = createContractERC20(chainId, TITANS_ADDRESS)
          // const contract = getContract(library, ERC20.abi, address)
          contract.methods
              .balanceOf(account)
              .call()
              .then((res) => {
                setBalance(res)
              })
         
        }
      } catch (e) {
        console.log('load token balance error:', e)
      }
    }
  }, [active, chainId, blockHeight])

  return { balance }
}

export const useAllowance = () => {
  const { account, active, library, chainId } = useActiveWeb3React()
  const [allowance, setAllowance] = useState()
  const blockHeight = useBlockHeight()
  useEffect(() => {
    if (!chainId){
      return () => {}
    }
    //console.log(chainId)
    const contract = createContractERC20( chainId, TITANS_ADDRESS)
    try {
      // const contract = getContract(library, ERC20.abi, contract_address)

      // console.log('request___8')
      contract.methods
        .allowance(account, TITANS_STAKING_ADDRESS)
        .call()
        .then((res) => {
          setAllowance(res)
          //console.log(res)
        })
    } catch (e) {
      console.log('load token allowance error:', e)
    }
    return () => {}
  }, [account, library, active, blockHeight])
  return {allowance}
}