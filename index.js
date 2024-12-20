let express = require('express');
// const { resolve } = require('path');

let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: './foodiefinds/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function getAllRestaurants() {
  let query = 'Select * from restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

async function getAllRestaurantsById(id) {
  let query = 'Select * from restaurants where id = ?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

async function getAllRestaurantsByCuisine(cuisine) {
  let query = 'Select * from restaurants where cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

async function getAllRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'Select * from restaurants where isVeg = ? and hasOutdoorSeating =? and isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

async function getAllRestaurantsSortedByRating() {
  let query = 'Select * from restaurants order by rating desc;';
  let response = await db.all(query, []);
  return { restaurants: response };
}

async function getAllDishes() {
  let query = 'Select * from dishes;';
  let response = await db.all(query, []);
  return { restaurants: response };
}

async function getAllDishesById(id) {
  let query = 'select * from dishes where id = ?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

async function getAllDishesByFilter(isVeg) {
  let query = 'Select * from dishes where isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

async function getDishesSortedByPrice() {
  let query = 'Select * from dishes order by price;';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await getAllRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants Found.' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await getAllRestaurantsById(id);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Restaurants Found for the id ' + id });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await getAllRestaurantsByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Restaurants Found for this cuisine ' + cuisine });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let result = await getAllRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: 'No Restaurants Found for the passed filters.',
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await getAllRestaurantsSortedByRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: 'No Restaurants Found',
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/dishes', async (req, res) => {
  try {
    let result = await getAllDishes();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found.' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await getAllDishesById(id);
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found for the id.' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let result = await getAllDishesByFilter(isVeg);
    if (result.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Dishes Found for the filter.' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await getDishesSortedByPrice();
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: 'No Dishes Found',
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
