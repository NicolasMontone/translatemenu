'use client'

import ReactCompareImage from 'react-compare-image'

export default function BeforeAfter() {
  return (
    <div className="min-w-[400px] w-full max-w-[600px] mx-auto">
      <ReactCompareImage leftImage="/before.png" rightImage="/after.png" />
    </div>
  )
}
