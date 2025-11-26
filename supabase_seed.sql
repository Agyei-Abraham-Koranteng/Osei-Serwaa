-- Seed Categories
insert into public.categories (id, name, description, display_order) values
('starters', 'Starters', 'Light bites to start your meal', 1),
('mains', 'Main Courses', 'Hearty traditional dishes', 2),
('sides', 'Sides', 'Perfect accompaniments', 3),
('drinks', 'Drinks', 'Refreshing beverages', 4)
on conflict (id) do nothing;

-- Seed Menu Items
insert into public.menu_items (name, description, price, category, image_url, featured, available, "spicyLevel") values
('Jollof Rice with Chicken', 'Spicy tomato-based rice served with grilled chicken and coleslaw.', 45.00, 'mains', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f1a?auto=format&fit=crop&w=800&q=80', true, true, 2),
('Waakye with Fish', 'Rice and beans cooked with millet leaves, served with fish, shito, and gari.', 40.00, 'mains', 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=800&q=80', true, true, 2),
('Fufu with Light Soup', 'Pounded cassava and plantain served with spicy light soup and goat meat.', 55.00, 'mains', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', true, true, 3),
('Banku with Tilapia', 'Fermented corn and cassava dough served with grilled tilapia and pepper.', 60.00, 'mains', 'https://images.unsplash.com/photo-1580476262716-6b3693166861?auto=format&fit=crop&w=800&q=80', true, true, 2),
('Red Red', 'Fried plantains served with spicy bean stew.', 35.00, 'mains', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80', false, true, 1),
('Kelewele', 'Spicy fried plantain cubes.', 15.00, 'starters', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80', true, true, 2),
('Sobolo', 'Spiced hibiscus drink.', 10.00, 'drinks', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', false, true, 0);

-- Seed Gallery Images
insert into public.gallery_images (src, alt, category) values
('https://images.unsplash.com/photo-1604329760661-e71dc83f8f1a?auto=format&fit=crop&w=800&q=80', 'Jollof Rice', 'Dishes'),
('https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=800&q=80', 'Waakye', 'Dishes'),
('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', 'Restaurant Interior', 'Ambiance'),
('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80', 'Outdoor Seating', 'Ambiance');



-- Seed Page Content (Hero Sections)
insert into public.page_content (page_slug, hero_title, hero_subtitle, hero_tagline) values
('home', 'Osei Serwaa Kitchen', 'Authentic West African Cuisine', 'Experience the rich flavors and traditions of Ghana in every dish'),
('about', 'About Us', 'Our Story & Heritage', 'Bringing authentic flavors to your table'),
('gallery', 'Gallery', 'Experience the Atmosphere', 'A visual journey through our cuisine and space'),
('contact', 'Contact Us', 'Get in Touch', 'We would love to hear from you')
on conflict (page_slug) do nothing;

-- Seed Home Features
insert into public.home_features (title, description, display_order) values
('Authentic Recipes', 'Traditional family recipes passed down through generations.', 1),
('Fresh Ingredients', 'We use only the freshest locally sourced ingredients.', 2),
('Warm Atmosphere', 'Experience true Ghanaian hospitality in our cozy setting.', 3),
('Catering Services', 'Let us make your special events memorable with our food.', 4);

-- Seed Home CTA
insert into public.home_cta (id, title, description) values
(1, 'Ready to Experience Authentic Ghanaian Cuisine?', 'Book a table now or order online for delivery.')
on conflict (id) do nothing;

-- Seed About Story
insert into public.about_story (id, paragraph1, paragraph2, paragraph3) values
(1, 'Osei Serwaa Kitchen started with a simple mission: to bring the authentic taste of Ghana to the world. Founded by Osei Serwaa, our kitchen is a tribute to the rich culinary heritage of West Africa.', 'Our journey began in a small family kitchen, where recipes were perfected over generations. Today, we are proud to share these flavors with our community, serving dishes that are not just food, but a celebration of culture.', 'We believe in the power of food to bring people together. That''s why we put love and care into every dish we serve, ensuring that every bite takes you on a journey to the heart of Ghana.')
on conflict (id) do nothing;

-- Seed About Values
insert into public.about_values (title, description, display_order) values
('Authenticity', 'We stay true to traditional recipes and cooking methods.', 1),
('Quality', 'We never compromise on the quality of our ingredients.', 2),
('Hospitality', 'We treat every guest like family.', 3);

-- Seed Contact Info
insert into public.contact_info (id, address, phone, email, weekday_hours, weekend_hours) values
(1, '123 Liberation Road, Accra, Ghana', '+233 24 750 5196', 'hello@oseiserwaa.com', 'Mon - Fri: 11:00 AM - 10:00 PM', 'Sat - Sun: 10:00 AM - 11:00 PM')
on conflict (id) do nothing;

-- Seed Footer Info
insert into public.footer_info (id, copyright_text, description, facebook_url, instagram_url, twitter_url) values
(1, '© 2024 Osei Serwaa Kitchen. All rights reserved.', 'Authentic Ghanaian cuisine in a modern, elegant setting.', 'https://facebook.com', 'https://instagram.com', 'https://twitter.com')
on conflict (id) do nothing;

-- Seed Site Content (Only for visitors count now)
insert into public.site_content (key, value) values
('site_visitors', '{"count": 0}')
on conflict (key) do nothing;
