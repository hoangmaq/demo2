
import React, { useContext, useEffect, useState } from 'react'
import copyRight from '../src/icons/copyRight.png'

export const Footer = () => {

  return (
    <footer className='footer'
        //style={{ zIndex: 0, backgroundColor: flag ? '#f2f0ea' : '' }}
    >
      <hr className='hr'/>
      <div className='footer_div'>
        <div className='footer_div_wrapper'>
          <p className='footer_div_wrapper_text'>
            2021 Titans Ventures. Copyright belongs to Titans Ventures.
          </p>
          <img className='footer_div_wrapper_img' src={copyRight}/>
        </div>
      </div>
    </footer>
  )
}