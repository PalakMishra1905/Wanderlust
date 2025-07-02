# 🌍 Wanderlust

Wanderlust is a full-stack listing website where users can **add**, **view**, **update**, and **delete** campground listings. It supports user authentication, image uploads with Cloudinary, and review/comment functionality.

## 🔧 Technologies Used

- **Frontend:** EJS, Bootstrap, HTML/CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** Passport.js (Local Strategy)
- **Templating:** EJS & EJS-mate
- **Others:** dotenv, connect-flash, express-session, Joi validation

## 📦 Features

- User authentication (Register/Login/Logout)
- Create, edit, and delete campgrounds
- Add and delete reviews to listings
- Upload images to Cloudinary
- Flash messages for success/error
- Server-side validation with Joi
- Responsive UI using Bootstrap

## 🌐 Live Demo

- https://wanderlust-4-rico.onrender.com/listings

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/PalakMishra1905/Wanderlust.git
cd Wanderlust

2. Install Dependencies
npm install

3. Set Up Environment Variables
Create a .env file in the root directory and add:
DB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret

4. Run the Server
npm start

📁 Project Structure
.
├── models/
│   ├── listing.js
│   └── review.js
├── routes/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── views/
│   ├── listings/
│   ├── reviews/
│   └── users/
├── public/
├── cloudinary/
├── middlewares/
├── schemas.js
├── app.js
└── ...

🙋‍♀️ Author
Palak Mishra
🔗 GitHub



