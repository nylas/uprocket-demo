# Uprocket Demo

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It demonstrates the use of the new Scheduler v3 components and Scheduling API to create a simple web application that allows users to schedule a meeting with a contractor.

# What's Inside
- How the [Nylas React](./package.json#L14) package can be installed in your application.
- How to [import components](./src/components/see-more-times.tsx#L3) in your application's frontend.
- How to [embed](./src/components/see-more-times.tsx#L103-L121) and configure the components.
- How to [generate and fetch](./src/pages/api/session.ts#L28) a session ID from the Nylas API's and use it to authenticate the components.

## Getting Started

1. [Fork](https://github.com/nylas/uprocket-demo/fork) the repository and clone it to your local machine.

2. Install the dependencies
    ```bash
    npm install
    ```
3. Copy the `.env-sample` file to `.env.local` and update the values with your Nylas App ID and Secret.
    ```bash
    cp .env-sample .env.local
    ```
4. Start the development server
    ```bash
    npm run dev
    ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
