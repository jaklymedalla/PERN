import React, { useEffect, useState  } from 'react'
import Cars from './components/Cars'

const App = () => {

  const [cars, setCars] = useState([])

  useEffect(() => {
        fetch('api/v1/cars')
        .then(res => res.json())
        .then(data => setCars(data))
        .catch(err => console.log(err))
  }, []);
  
  return (
    <div>
      <h1>Welcome to Car Store</h1>
       <ul>
        {cars.map(car => (
          <Cars key={car.id} {...car} />
        ))}
       </ul>
      </div>
  )
}

export default App