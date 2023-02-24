import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import {Contract, utils} from 'ethers'
import TrancheJson from './abis/TrancheVault.json'
import {useQuery} from '@tanstack/react-query'

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Link = styled.a`
  margin-top: 8px;
`

const tokenAddress = '0x73A32faCe84D5cbA8D98DB46b57458D26D9adC07'
const tokenContract = new Contract(tokenAddress, TrancheJson.abi)

const trancheAddress = '0xB109f96a0B0F815453dd88f07b0AE9b0aDaaC041'
const trancheContract = new Contract(trancheAddress, TrancheJson.abi)

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()

  const {data: balance} = useQuery({
    queryKey: ['trancheBalance', sdk],
    queryFn: async () => {
      const data = trancheContract.interface.encodeFunctionData('totalAssets', [])
      const trancheCallResult = await sdk.eth.call([{to: trancheAddress, data}])
      const accountBalance = trancheContract.interface.decodeFunctionResult('totalAssets', trancheCallResult)
      return utils.formatUnits(accountBalance[0], 6)
    }
  })

  const {data: allowance} = useQuery({
    queryKey: ['trancheAllowance', sdk],
    queryFn: async () => {
      const data = tokenContract.interface.encodeFunctionData('allowance', [safe.safeAddress, trancheAddress])
      const trancheCallResult = await sdk.eth.call([{to: tokenAddress, data}])
      const accountBalance = trancheContract.interface.decodeFunctionResult('allowance', trancheCallResult)
      return utils.formatUnits(accountBalance[0], 6)
    }
  })

  const submitTx = useCallback(async () => {
    try {
      const depositAmount = utils.parseUnits('100', 6)
      // const approveData = tokenContract.interface.encodeFunctionData('approve', [trancheAddress, depositAmount])
      // console.log(utils.parseUnits(allowance ?? '0', 6).toString(), depositAmount.toString())
      // if(utils.parseUnits(allowance ?? '0', 6).lt(depositAmount)) {
        // await sdk.txs.send({
        //   txs: [
        //     {
        //       to: tokenAddress,
        //       value: '0',
        //       data: approveData
              
        //     }
        //   ]
        // })
      // }
      const lendData = trancheContract.interface.encodeFunctionData('deposit', [depositAmount, safe.safeAddress])
      await sdk.txs.send({
        txs: [
          {
            to: trancheAddress,
            value: '0',
            data: lendData,
          },
        ],
      })
    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk, allowance])

  return (
    <Container>
      <Title size="md">Safe: {safe.safeAddress}</Title>

      <Button size="lg" color="primary" onClick={submitTx}>
        Click to send a test transaction
      </Button>

      <Link href="https://github.com/safe-global/safe-apps-sdk" target="_blank" rel="noreferrer">
        Documentation
      </Link>
      <div>Safe address: {safe.safeAddress}</div> 
      <div>Tranche balance: {balance}</div>
      <div>Tranche allowance: {allowance}</div>
    </Container>
  )
}

export default SafeApp
