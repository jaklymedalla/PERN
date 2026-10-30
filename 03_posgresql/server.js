import express from 'express';
import { eq } from 'drizzle-orm'; // 1. Added this import to handle WHERE clauses
import { db } from './db.js';
import { cars } from './schema.js';

const app = express();
const port = 3000;

const router = express.Router();

app.use(express.json());

// Middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello from the Cars API');
});

// GET ALL CARS (Fixed: Now queries PostgreSQL)
router.get('/', async (req, res) => {
    try {
        const allCars = await db.select().from(cars);
        res.json(allCars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET CAR BY ID (Fixed: Now searches by ID in the database)
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [car] = await db.select().from(cars).where(eq(cars.id, id));

        if (!car) return res.status(404).send('Car not Found');

        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Create a new car (Kept your working logic with error handling wrapped)
router.post('/', async (req, res) => {
    try {
        const { make, model, year, price } = req.body;

        if (!make || !model || !year || !price) {
            return res.status(400).json({ error: "Missing Fields" });
        }

        const [newCar] = await db.insert(cars).values({ make, model, year, price }).returning();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Update an existing car fully (Fixed: Now performs a database update)
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { make, model, year, price } = req.body;

        const [updatedCar] = await db
            .update(cars)
            .set({ make, model, year: year ? Number(year) : undefined, price: price ? String(price) : undefined })
            .where(eq(cars.id, id))
            .returning();

        if (!updatedCar) {
            return res.status(404).json({ error: "Car not found" });
        }

        res.json(updatedCar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove a car from the database (Fixed: Now deletes from PostgreSQL)
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const [deletedCar] = await db
            .delete(cars)
            .where(eq(cars.id, id))
            .returning();

        if (!deletedCar) {
            return res.status(404).json({ error: "Car not found" });
        }

        res.json({ message: "Car deleted", car: deletedCar });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use('/api/v1/cars', router);
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
