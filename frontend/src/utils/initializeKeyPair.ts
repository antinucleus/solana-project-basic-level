import { PAYER_SECRET } from '../config'
import * as web3 from '@solana/web3.js'

export const initializeKeypair = async (): Promise<web3.Keypair> => {
  const secret = JSON.parse(PAYER_SECRET ?? '') as number[]
  const secretKey = Uint8Array.from(secret)
  const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey)

  return keypairFromSecretKey
}

export const airdropSolIfNeeded = async (
  signer: web3.Keypair,
  connection: web3.Connection
) => {
  console.log('Airdropping 1 SOL')

  const signature = await connection.requestAirdrop(
    signer.publicKey,
    web3.LAMPORTS_PER_SOL * 1
  )

  await connection.confirmTransaction(signature)
}

export const getBalance = async (
  signer: web3.Keypair,
  connection: web3.Connection
): Promise<number> => {
  const balance = await connection.getBalance(signer.publicKey)

  return balance / web3.LAMPORTS_PER_SOL
}
