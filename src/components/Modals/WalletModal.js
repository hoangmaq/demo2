import React, { useContext, useEffect, useState } from 'react'
import {
  GALLERY_SELECT_WEB3_CONTEXT,
  HANDLE_WALLET_MODAL,
} from '../../const'
import { mainContext } from '../../reducer'
import close from '../../assets/icon/close.png'
import { useActiveWeb3React } from '../../web3'
import { useWeb3React } from '@web3-react/core'
import { FormattedMessage } from 'react-intl'
import { CSVLink } from "react-csv";
import {useStakingInfo} from '../../pages/stake/Hooks'
import {useHolderListInfo} from '../../pages/stake/Hooks'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { ChainId } from '../../web3/address'

export const WalletModal = ({ onChange, onClose }) => {
  const context = useWeb3React()
  const { dispatch, state } = useContext(mainContext)
  //const { account, active, library, chainId } = useActiveWeb3React()
  const farmPools = useStakingInfo()
  const holderList = useHolderListInfo()

  const {
    connector,
    library,
    account,
    activate,
    deactivate,
    active,
    chainId,
    error,
  } = context
  //const { chainId } = useActiveWeb3React()
  const isValidChainID = active && (chainId == ChainId.BSC || chainId == ChainId.BSC_TESTNET); 

  const headers = [
    { label: "Wallet Address", key: "WalletAddress" },
    { label: "Staked Amount (Titans)", key: "Staked" },
    { label: "Tier", key: "Tier" },
  ];
  
    const checkUserRank = (staked)=>{
      //let staked = formatAmount(_staked);
      if (staked >= 100 && staked < 1000) {
        return 'Silver'
      } else if (staked >= 1000 && staked < 5000) {
        return 'Pink'
      } else if (staked >= 5000 && staked < 10000) {
        return 'Golden'
      } else if (staked >= 10000) {
        return 'Platium'
      } else {
        return 'No tier'
      }
    }
    const getTopRanking = (list) =>{
      let rankingList = [];
      if(list)
      list.stakeHolderList[0].forEach((address,i) =>{
        var staked = formatAmount(list.stakeHolderList[1][i]);
        let tier = checkUserRank(staked)
        
          rankingList.push({
            WalletAddress: address, 
            Staked: staked,
            Tier: tier
          })
        
      })
      return rankingList;
    }
 
  const [tier, setTier] = useState('Stake to get tier');
  useEffect(()=> {
    farmPools&& setTier(checkUserRank())
  },[farmPools]);

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner transction-submitted'>
            <div
              className='form-app__inner__header'
              style={{ maxWidth: 'inherit' }}
            >
              <FormattedMessage id='modalsText59' />
            </div>
            { (isValidChainID && active && farmPools && farmPools.owner == account) 
              && 
                <CSVLink data={
                  getTopRanking(holderList)} 
                  headers={headers}
                  className='csvLink'
                  filename={"Tier List.csv"}
                  >For Owner: Get Tier List
                </CSVLink>
            }
             <button
              style={{ marginTop: 30, width: '100%' }}
              type='button'
              className=' transction-submitted__btn'
              onClick={() => {
                deactivate()
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
                window &&
                  window.localStorage.removeItem(GALLERY_SELECT_WEB3_CONTEXT)
              }}
            >
            
              <FormattedMessage id='modalsText62' />
            </button>
           
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