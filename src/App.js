import React, {useContext, useEffect} from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import './assets/css/style.scss'
import { Header } from './components/header/Header'
import {Footer} from './Footer'

import {ContextProvider, mainContext} from './reducer'
import { InitPage } from './pages/InitPage'
import StakeCard from './components/staking/stakeCard'
import TierRank from './components/Tier/TierRank'
import UserRank from './components/Tier/UserRank'
 import ScrollToTop from './components/ScrollTop'
 import Intl from './locale/intl'

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 8000
  console.log(library, 'library')
  return library
}

function App() {

  useEffect(() => {
    const el = document.querySelector('.loader-container')
    if (el) {
      el.remove()
    }
  }, [])

  return (
    <ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
      <Intl>
          <Router>
            <ScrollToTop />
            <Header />
            <StakeCard/>
            <UserRank/>
            {/* <TierRank/> */}
            <InitPage />
            <Footer/>
          </Router>
        </Intl>
      </Web3ReactProvider>
    </ContextProvider>
  )
}

export default App