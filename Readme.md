# Full-stack DApp(Decentralized Application) Development

## Prerequisites

- You have to install **solana-cli** and **rust** on your machine

## Introduction

- This is the first version of the solana program (smart-contract)
- In this version of the program, it only do one thing that print **"This is local rust program"** and the received **ProgramId** as below

  `msg!("This is local rust program");`

  `msg!("[Program Id]:{:?}", &program_id);`

## Applications

- There are 3 applicaiton folder, Backend, Client, Frontend

> Backend

- This application is solana program (smart-contract)

> Client

- There is client application for sending transaction to backend program.
- This application runs on ts-node

> Frontend

- This is also client application. But this created with ReactJs
- This application runs on web
- This application will do samething with client application. Only difference is that **Client** application runs on ts-node, **Frontend** application runs on web therefore it provides us UI.

## How to use

> First we have to start solana local development server. You can start it automatically(easy to start) or manually

### Automated

- First run this command in terminal

  `solana-test-validator`

- After that run this command in another terminal at fullstack-dapp directory

  `./build-and-deploy.sh`

### Manual

- set Solana CLI configuration points to localhost.

  `solana config set --url localhost`

- Build rust program

  `cargo build-bpf`

- Run a local test validator

  `solana-test-validator`

- Deploy rust program. This requires PATH. It will be found under project_location>target>deploy>backend.so

  `solana program deploy <PATH>`

- View program logs. This require PROGRAM_ID. This will be generated at deploying section.

  `solana logs <PROGRAM_ID>`

> Client

- When started the solana local development server you get a program id. You can find it inside **programId.txt** file.
- Copy it.
- Open client/src/index.ts file.
- Replace programId variable with your program id

  ```
  // change string inside the function with your programId

  const programId: web3.PublicKey = new web3.PublicKey(
  'EH9vud5c8WYSoz3y6AWxmTDhxSJu4CdZyzeLHNEwfe4B'
  )

  ```

- Run this command in client directory at terminal for installing node modules

  `yarn install`

- Run this command for starting client application

  `yarn start`

> Frontend

- In .env file there are 3 variables.

  1(RPC_URL): Get your local address this address run this command
  `solana config get | grep "RPC URL"`. Replace **RPC_URL** variable with this rpc url

  2(PROGRAM_ID): When started the solana local development server you get a program id. You can find it inside **program-id.txt** file.Replace **PROGRAM_ID** variable with your program id

  3)(PAYER_SECRET): This is secret key of your wallet. This is optional if you want you can use same key or you can generate one of them with `web3.Keypair.generate()`. This return Keypair(public and secret key pair). Replace **PAYER_SECRET** variable with generated secret key (not public)

- Run this command in client directory at terminal for installing node modules

  `yarn install`

- Run this command for starting client application

  `yarn start`
