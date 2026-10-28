import express from 'express'

const app = express();
const port = 3000;

const router = express.Router();

app.use(express.json())

//Middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${req.method} ${req.url}`);

    next();
})

let cars = [
    {id: 1, make: "Toyota", model: "Camry", year:2022, price: 28000},
    {id: 2, make: "Tesla", model: "Model S", year:20223, price: 25000},
    {id: 3, make: "Ford", model: "F-150", year:2021, price: 35000},
]


app.get('/', (req, res) => {
    res.send('Hello from the Cars API');
});

router.get('/', (req, res) => {
    res.json(cars)
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const car = cars.find((car) => car.id == id);

    if(!car) return res.status(404).send('Car not Found')

    res.json(car)
});

// POST: Create a new car
router.post('/', (req, res) => {
    const {make, model, year, price } = req.body;

    if(!make || !model || !year || !price){
        return res.status(400).json({error: "Missing Fields"});
    }

    const newCar = {
        id: cars.length + 1,
        make,
        model,
        year: Number(year),
        price: Number(price)
    }

    cars.push(newCar);
    res.status(201).json(newCar);
});

// PUT: Update an existing car fully
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const carIndex = cars.findIndex((car) => car.id === id);

    if (carIndex === -1) {
        return res.status(404).json({error: "Car not found"});
    }

    const {make, model, year, price } = req.body;

    if(make) cars[carIndex].make = make;
    if(model) cars[carIndex].model = model;
    if(year) cars[carIndex].year = Number(year);
    if(price) cars[carIndex].price = Number(price);

    res.json(cars[carIndex]);
});

// DELETE: Remove a car from the array
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const carIndex = cars.findIndex((car) => car.id === id);

    if (carIndex === -1) {
        return res.status(404).json({error: "Car not found"});
    }

    // Remove 1 item at the found index
    const deletedCar = cars.splice(carIndex, 1)[0];

    // Return the deleted item to confirm it's gone
    res.json({error: "Car deleted", car: deletedCar});
});




app.use('/api/v1/cars', router);
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));