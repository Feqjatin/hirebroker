require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/jatin_first_db", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Schema for j1 collection
const j1Schema = new mongoose.Schema({
  username: { type: String, required: true },
});

const J1 = mongoose.model("j1", j1Schema);

// Routes

// Register route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Save the user
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user exists and password matches
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Delete all names from j1
    await J1.deleteMany({});
    console.log("Deleted all records from j1");

    // Add logged-in user's name to j1
    const newEntry = new J1({ username: user.name });
    await newEntry.save();
    console.log(`Added ${user.name} to j1`);

    res.status(200).json({ message: `  ${user.name}` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to get current username from j1
app.get("/currinfo", async (req, res) => {
  try {
    const data = await J1.findOne(); // Assuming you want the first document
    if (!data) {
      return res.status(404).json({ message: "No data found in j1 collection" });
    }
    res.status(200).json({ username: data.username });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/currinfonull", async (req, res) => {
  try {
    // Delete all documents in the `j1` collection
    await J1.deleteMany({});
    res.status(200).json({ message: "All data removed from j1 table successfully" });
  } catch (error) {
    console.error("Error clearing j1 table:", error.message);
    res.status(500).json({ message: "Failed to clear j1 table", error: error.message });
  }
});

const companyServiceSchema = new mongoose.Schema({
  companyServiceId: { type: String, unique: true }, // Unique service ID
  companyName: String,
  position: String,
  location: String,
  employmentType: String,
  salary: String,
  applicants: Number,
});


const CompanyService = mongoose.model("CompanyService", companyServiceSchema);

// GET job information endpoint
app.get("/getjobinfo", async (req, res) => {
  try {
    const jobs = await CompanyService.find(); // Fetch all job data
    res.json(jobs);
  } catch (err) {
    res.status(500).send("Error retrieving job information.");
  }
});




 

 










const serviceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  salary: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String },
});


const ppp = mongoose.model("listOfService", serviceSchema);

// GET job information endpoint
app.get("/getservicesinfo", async (req, res) => {
  try {
    const jobs = await ppp.find(); // Fetch all job data
    res.json(jobs);
  } catch (err) {
    res.status(500).send("Error retrieving job information.");
  }
});

 

 
app.use(express.json());

// Define companyInfo schema
const companySchema = new mongoose.Schema({
    companyName: String,
    companyType: String,
    headquarterAddress: String,
    gstin: String,
    incomeTax: String
});

// Define companyInfoTemp schema
const companyInfoTempSchema = new mongoose.Schema({
    companyName: String,
    companyType: String,
    headquarterAddress: String,
    gstin: String,
    incomeTax: String
});

// Create Models
const Company = mongoose.model('companyInfo', companySchema);
const CompanyInfoTemp = mongoose.model('companyinfotemp', companyInfoTempSchema);

// POST /checkinfo route to handle the form submission
app.post('/checkinfo', async (req, res) => {
    const { companyName, companyType, headquarterAddress, gstin, incomeTax } = req.body;

    try {
        // Check if company exists in the database
        const existingCompany = await Company.findOne({ companyName, gstin });

        if (!existingCompany) {
            return res.json({ success: false, message: 'Company does not exist in the database' });
        }

        // Company exists, add the data to the companyInfoTemp table
        const newTempCompany = new CompanyInfoTemp({
            companyName,
            companyType,
            headquarterAddress,
            gstin,
            incomeTax
        });

        await newTempCompany.save();

        res.json({ success: true, message: 'Company information added to companyInfoTemp' });
    } catch (error) {
        console.error('Error during company checking and registration:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

const lastCompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  storedAt: { type: Date, default: Date.now }, // Automatically stores the timestamp when the record is created
});
 
const LastCompany = mongoose.model('LastCompany', lastCompanySchema);

// Endpoint to handle /storeCompany
app.get('/storeCompany', async (req, res) => {
    const { companyName } = req.query;

    try {
        if (!companyName) {
            return res.status(400).json({ success: false, message: 'Company name is required' });
        }

        // Delete all existing records from lastcompany table
        await LastCompany.deleteMany({});

        // Create a new record with the provided companyName
        const newCompany = new LastCompany({ companyName });

        // Save the new record
        await newCompany.save();
        console.log("aave");

        res.json({ success: true, message: 'Company name stored successfully', data: newCompany });
    } catch (error) {
        console.error('Error during storing company name:', error);
        res.status(500).json({ success: false, message: 'An error occurred while storing company name' });
    }
});


// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
