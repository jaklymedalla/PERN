import React from 'react'

const Cars = ({make, model, year, price}) => {
  return (
    <div>
        <li>
            <p>Make: {make}</p>
            <p>Model: {model}</p>
            <p>Year: {year}</p>
            <p>Price: {price}</p>
        </li>
    </div>
  )
}

export default Cars