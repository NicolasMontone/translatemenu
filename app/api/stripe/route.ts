import Stripe from 'stripe'
import { updateUserIsProByEmail } from '@/db/user'

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    // https://github.com/stripe/stripe-node#configuration
    // https://stripe.com/docs/api/versioning
    // @ts-ignore
    apiVersion: null,
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: 'Translate Menu',
      version: '0.0.0',
      url: 'https://translatemenu.com',
    },
  }
)

const relevantEvents = new Set([
  'customer.subscription.created',
  'checkout.session.completed'
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 })
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    console.log(`🔔  Webhook received: ${event.type}`)
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(`❌ Error message: ${err.message}`)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }
    return new Response('Unknown error', { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'customer.subscription.created': {
          const subscription = event.data.object as Stripe.Subscription

          const customerID = subscription.customer

          const { email } = (await stripe.customers.retrieve(
            customerID.toString()
          )) as Stripe.Customer

          if (!email) {
            return new Response('No email found for customer', { status: 200 })
          }

          await updateUserIsProByEmail(email, true)

          break
        }
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session
          
          if (session.payment_link === 'plink_1QOJtQD3sxiLFHCHc0gh1DqG') {
            const customerEmail = session.customer_details?.email
            
            if (!customerEmail) {
              return new Response('No email found for customer', { status: 200 })
            }

            await updateUserIsProByEmail(customerEmail, true)
          }
          
          break
        }
        default:
          throw new Error('Unhandled relevant event!')
      }
    } catch (error) {
      console.log(error)
      return new Response(
        'Webhook handler failed. View your Next.js function logs.',
        {
          status: 400,
        }
      )
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    })
  }
  return new Response(JSON.stringify({ received: true }))
}
