import * as web3 from '@solana/web3.js'
import { initializeKeypair } from './initializeKeypair'
import Dotenv from 'dotenv'
Dotenv.config()

const connection: web3.Connection = new web3.Connection('http://localhost:8899')

// Replace with your program id
const programId: web3.PublicKey = new web3.PublicKey(
  'EH9vud5c8WYSoz3y6AWxmTDhxSJu4CdZyzeLHNEwfe4B'
)

async function main() {
  const payer = await initializeKeypair(connection)

  try {
    const transactionSignature = await sendTransaction(payer)

    console.log(
      `Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=custom`
    )
  } catch (error) {
    console.log('[Error occured]:', error)
  }
}

main()
  .then(() => {
    console.log('Finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })

const sendTransaction = async (
  payer: web3.Keypair
): Promise<web3.TransactionSignature> => {
  const transaction = new web3.Transaction()

  const instruction = new web3.TransactionInstruction({
    keys: [],
    programId
  })

  transaction.add(instruction)

  const transactionSignature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  )

  return transactionSignature
}
