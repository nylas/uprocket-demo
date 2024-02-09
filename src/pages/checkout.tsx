import React from 'react'
import { PaymentCheckout } from '@/components/payment-checkout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useConfirmedTimeslot, useLoggedInUser } from '@/lib/hooks'

const CheckoutPage: React.FC = () => {
  const router = useRouter()
  const { isLoading } = useLoggedInUser()
  const { confirmedTimeslot } = useConfirmedTimeslot()

  if (isLoading) return null
  // Redirect to home if no timeslot is confirmed

  if (!confirmedTimeslot) {
    router.push('/contractors')
    return null
  }

  return (
    <>
      <Head>
        <title>Checkout - UpRocket</title>
        <meta name='description' content='Checkout' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <PaymentCheckout />
    </>
  )
}

export default CheckoutPage
