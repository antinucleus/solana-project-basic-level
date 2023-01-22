import * as web3 from '@solana/web3.js'

type SendTransactionParams = {
  connection: web3.Connection
  programId: web3.PublicKey
  payer: web3.Keypair
}

export const sendTransaction = async ({
  connection,
  programId,
  payer
}: SendTransactionParams): Promise<web3.TransactionSignature> => {
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
