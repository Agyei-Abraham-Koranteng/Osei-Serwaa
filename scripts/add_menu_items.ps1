$dishes = @(
    @{name="Jollof Rice"; description="Our signature West African rice dish cooked in a rich tomato sauce with aromatic spices, served with your choice of protein"; price=45.00; category="Main Dishes"; image=""},
    @{name="Banku with Tilapia"; description="Traditional fermented corn and cassava dough served with grilled tilapia and spicy pepper sauce"; price=55.00; category="Main Dishes"; image=""},
    @{name="Waakye"; description="Rice and beans cooked with millet leaves, served with spaghetti, gari, boiled egg, and your choice of protein"; price=40.00; category="Main Dishes"; image=""},
    @{name="Fufu with Light Soup"; description="Pounded cassava and plantain served with aromatic tomato-based soup and goat meat"; price=50.00; category="Main Dishes"; image=""},
    @{name="Red Red"; description="Black-eyed peas stew cooked in palm oil with plantains and gari"; price=35.00; category="Main Dishes"; image=""},
    @{name="Kelewele"; description="Spicy fried plantains seasoned with ginger, pepper, and aromatic spices"; price=15.00; category="Appetizers"; image=""},
    @{name="Chinchinga (Kebabs)"; description="Grilled skewered meat marinated in traditional spices and peanut powder"; price=25.00; category="Appetizers"; image=""},
    @{name="Groundnut Soup"; description="Rich peanut-based soup with chicken or beef, served with rice balls or fufu"; price=48.00; category="Soups"; image=""},
    @{name="Palmnut Soup"; description="Creamy palm fruit soup with assorted meats and fish, served with fufu"; price=52.00; category="Soups"; image=""},
    @{name="Sobolo (Hibiscus Drink)"; description="Refreshing hibiscus flower drink with ginger and pineapple"; price=10.00; category="Beverages"; image=""},
    @{name="Asana (Corn Drink)"; description="Traditional fermented corn drink, sweet and refreshing"; price=8.00; category="Beverages"; image=""},
    @{name="Bofrot (Puff Puff)"; description="Sweet fried dough balls, perfect with tea or as a snack"; price=12.00; category="Desserts"; image=""}
)

Write-Host "Adding menu items to database..." -ForegroundColor Green

foreach ($dish in $dishes) {
    $body = @{
        name = $dish.name
        description = $dish.description
        price = $dish.price
        category = $dish.category
        image = $dish.image
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/menu" -Method Post -Body $body -ContentType "application/json"
        Write-Host "✓ Added: $($dish.name) - GH₵$($dish.price)" -ForegroundColor Cyan
    } catch {
        Write-Host "✗ Error adding $($dish.name): $_" -ForegroundColor Red
    }
}

Write-Host "`nDone! Checking total items..." -ForegroundColor Green
$items = Invoke-RestMethod -Uri "http://localhost:3001/api/menu" -Method Get
Write-Host "Total menu items: $($items.Count)" -ForegroundColor Yellow
