import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useLoggedInUser } from '@/lib/hooks'
import { BookingConfirmation } from '@/components/booking-confirmation'

const CheckoutPage: React.FC = () => {
  const router = useRouter()
  const { isLoading } = useLoggedInUser()

  if (isLoading) return null

  return (
    <>
      <Head>
        <title>Confirmation - UpRocket</title>
        <meta name='description' content='Confirmation' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <BookingConfirmation />
    </>
  )
}

export default CheckoutPage
