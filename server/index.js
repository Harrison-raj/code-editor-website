const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/run", async (req, res) => {
  const { code, language_id } = req.body;

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code: code,
        language_id: language_id,
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": "fcdb59df93mshbb4fb8bb997aeb6p1d312bjsn1cfda100223d", // Replace this
        },
      }
    );

    const token = response.data.token;

    // Wait for result
    setTimeout(async () => {
      const result = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "fcdb59df93mshbb4fb8bb997aeb6p1d312bjsn1cfda100223d", // Replace this too
          },
        }
      );

      res.json({ output: result.data.stdout || result.data.stderr });
    }, 2000); // wait for 2 seconds
  } catch (error) {
    res.status(500).json({ error: "Error running code" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
 
