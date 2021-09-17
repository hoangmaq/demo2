import React, { useContext, useEffect, useMemo, useState } from 'react'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import {useHolderListInfo} from '../../pages/stake/Hooks'
import { injectIntl } from 'react-intl'
import { mainContext } from '../../reducer'
import { forEach } from 'lodash'
import { CSVLink } from "react-csv";

export  const TierRank = (props) => {
  const { intl, icon, onClose } = props
  const holderList = useHolderListInfo()
  const headers = [
    { label: "Wallet Address", key: "WalletAddress" },
    { label: "Staked", key: "Staked" },
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
    // const [data,setData] = useState([]);
    // useEffect (()=>{
    //   setData(getTopRanking(holderList))
    // },[holderList]);

  return (
      <div className='table' >
        <hr className='hr'/>
        <div className='table_box'>
            <div className='table_header'>
                <p className='table_header_row1_a'>Investor List</p>
                <div className='table_header_wrapper_row1_b'>
                    <p className='table_header_row1_b'>1500</p>
                </div>
            </div>
            <div className='table_tab_box'>
                <div className='table_tab_box_top'>
                                 </div>
                <div className='table_tab_box_search'>
                    {/* <img className='table_tab_box_search_img' src={search}/> */}
                    <input className='table_tab_box_search_input'>
                            
                    </input>
                </div>
          
                
            </div>
            <div className='table_list_box'>
            <div style={{ height: 588, width: '100%' }}>
              {/* <DataGrid className={classes.root, classes.columnHeader}
                rows={rows}
                columns={columns}
                pageSize={Object.keys(rows).length < 10 ? Object.keys(rows).length : 10}
                //checkboxSelection
                disableSelectionOnClick
              /> */}
              {/* <csvlink {...csvReport}>Export to CSV</csvlink> */}
              <CSVLink data={
                getTopRanking(holderList)} 
                headers={headers}
                filename={"Tier List.csv"}
              >Get Tier List</CSVLink>;
            </div>
            </div>
        </div>
      </div>
  )
}

export default injectIntl((props) => {
    const { dispatch, state } = useContext(mainContext)
    return useMemo(() => <TierRank {...props} dispatch={dispatch} />, [dispatch, props])
  })