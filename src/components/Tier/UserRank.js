import React, { useContext, useEffect, useMemo, useState } from 'react'
import {useStakingInfo} from '../../pages/stake/Hooks'
import { injectIntl } from 'react-intl'
import { mainContext } from '../../reducer'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'




export  const UserRank = (props) => {
  const { intl, icon, onClose } = props
  const farmPools = useStakingInfo()
  const checkUserRank = ()=>{
    let staked = farmPools && formatAmount(farmPools.staked);
    if (staked >= 100 && staked < 1000) {
      return 'Silver'
    } else if (staked >= 1000 && staked < 5000) {
      return 'Pink'
    } else if (staked >= 5000 && staked < 10000) {
      return 'Golden'
    } else if (staked >= 10000) {
      return 'Platium'
    } else {
      return 'Not Yet'
    }
  }
  const [tier, setTier] = useState('No tier');
  useEffect(()=> {
    farmPools&& setTier(checkUserRank())
  },[farmPools]);

  return (
      <div className='rank'>
        <div className='rank_card'>
          {/* <h3 className='h3'>Your Tier</h3> */}
          <h3 className='h3'>Your Tier: {tier} </h3>
        </div>
      </div>
  )
}

export default injectIntl((props) => {
    const { dispatch, state } = useContext(mainContext)
    return useMemo(() => <UserRank {...props} dispatch={dispatch} />, [dispatch, props])
  })