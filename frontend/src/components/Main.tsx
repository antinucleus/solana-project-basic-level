import React, { useEffect, useState } from 'react'
import * as web3 from '@solana/web3.js'
import {
  Button,
  Center,
  HStack,
  Badge,
  Wrap,
  WrapItem,
  Text,
  Stack,
  Spinner,
  useToast
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  sendTransaction,
  initializeKeypair,
  airdropSolIfNeeded,
  getBalance
} from '../utils'
import { CONNECTION, PROGRAMID } from '../config'

// Connection
const connection: web3.Connection = new web3.Connection(CONNECTION)

// Our program id
const programId: web3.PublicKey = new web3.PublicKey(PROGRAMID)

export const Main = () => {
  const toast = useToast()

  const [transactionUrl, setTransactionUrl] = useState<string>('')
  const [userKeyPair, setUserKeyPair] = useState<web3.Keypair | undefined>()
  const [userPubKey, setUserPubKey] = useState<string>('')
  const [userBalance, setUserBalance] = useState<number | undefined>(undefined)
  const [accountInfoLoading, setAccountInfoLoading] = useState<boolean>(true)
  const [isTransactionStarted, setIsTransactionStarted] =
    useState<boolean>(false)

  useEffect(() => {
    setAccount()
  }, [])

  const setAccount = async () => {
    toast({
      title: 'Account Initializing',
      description: 'Initializing keypair please wait',
      status: 'loading',
      duration: 2000,
      isClosable: true
    })

    const keyPair: web3.Keypair = await initializeKeypair()
    setUserKeyPair(keyPair)
    setUserPubKey(keyPair.publicKey.toBase58())

    try {
      const balance: number = await getBalance(keyPair, connection)

      if (balance >= 0 && balance < 1) {
        toast({
          title: 'Airdrop',
          description: 'Balance is less than 1 SOL,airdropping 1 SOL',
          status: 'loading',
          duration: 2000,
          isClosable: true
        })
        await airdropSolIfNeeded(keyPair, connection)
      }
      setUserBalance(balance)

      setAccountInfoLoading(false)
    } catch (error) {
      toast.closeAll()
      console.log('[Error occured]:', error)
      setAccountInfoLoading(false)

      toast({
        title: 'Connection Error',
        description: `Connection failed.Open console and see the error`,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const handleSendTransaction = async () => {
    try {
      if (userKeyPair) {
        setIsTransactionStarted(true)
        const transactionSignature: web3.TransactionSignature =
          await sendTransaction({ connection, programId, payer: userKeyPair })

        const url: string = `https://explorer.solana.com/tx/${transactionSignature}?cluster=custom`
        console.log(url)

        toast({
          title: 'Transaction Signature',
          description: `Transaction is done successfully`,
          status: 'success',
          duration: 5000,
          isClosable: true
        })

        setTransactionUrl(url)
        setIsTransactionStarted(false)
      }
    } catch (error) {
      console.log('[Error occured]:', error)
      setIsTransactionStarted(false)

      toast({
        title: 'Transaction Error',
        description: `Transaction failed. Open console and see the error`,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <Stack p='1.5' spacing='14'>
      {accountInfoLoading && (
        <Center>
          <Spinner size='xl' />
        </Center>
      )}
      <HStack spacing='10'>
        <Badge>
          <Wrap>
            <WrapItem>
              <Text>Wallet</Text>
            </WrapItem>
            <WrapItem>
              {userPubKey.slice(0, 4) +
                '...' +
                userPubKey.slice(userPubKey.length - 4)}
            </WrapItem>
          </Wrap>
        </Badge>

        <Badge>
          <Wrap>
            <WrapItem>
              <Text>Balance</Text>
            </WrapItem>
            <WrapItem>{userBalance} SOL</WrapItem>
          </Wrap>
        </Badge>
      </HStack>

      <Stack align='center'>
        <Button
          w='md'
          isDisabled={!userBalance}
          isLoading={isTransactionStarted}
          onClick={handleSendTransaction}
          colorScheme='blue'
          variant='outline'
        >
          Send Transaction
        </Button>
      </Stack>
      <Wrap>
        <WrapItem>
          {transactionUrl && !isTransactionStarted && (
            <Link href={transactionUrl} isExternal>
              See transaction <ExternalLinkIcon mx='2px' />
            </Link>
          )}
        </WrapItem>
      </Wrap>
    </Stack>
  )
}
