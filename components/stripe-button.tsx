import { Sparkle } from 'lucide-react'
import StripeLink from './stripe-link'

export default function StripeButton() {
  return (
    <StripeLink>
      <button
        type={'button'}
        className={`
    relative overflow-hidden group
    px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg
    border border-white border-opacity-20
    transition-all duration-300 ease-out
    hover:shadow-lg
    text-white font-medium
  `}
      >
        <div className="relative z-10 flex items-center space-x-3">
          Make Me Pro <Sparkle className="ml-2 w-4 h-4 text-yellow-500" />
        </div>
        <div
          className={`
            absolute inset-0 
            bg-gradient-to-r from-transparent via-white to-transparent
            opacity-20 
            transform -translate-x-full group-hover:translate-x-full
            transition-transform duration-1000 ease-out
        `}
        />
      </button>
    </StripeLink>
  )
}
