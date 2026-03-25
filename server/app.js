
const express = require('express');
const cors = require('cors');
const db = require('./db');
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');
const viewRoutes = require('./routes/viewRoutes');
const commentRoutes = require('./routes/commentRoutes');
const categoryRoutes = require("./routes/categoryRoutes");
const reactionRoutes = require("./routes/reactionRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/views', viewRoutes);
app.use('/api/comments', commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/profile", profileRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port " + (process.env.PORT || 3000));
});
