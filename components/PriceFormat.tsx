import React from 'react'

function PriceFormat( price: number ) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price) 
}

export default PriceFormat