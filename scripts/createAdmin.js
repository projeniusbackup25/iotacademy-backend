require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    const admins = [
      {
        name: "Karthick Ganesh",
        phone: "9025476322",
        email: "projenius.iotacademymain@gmail.com",
        password: "TeamProjenius@25"
      },
      {
        name: "Harshini",
        phone: "9384395955",
        email: "projenius.iotacademyharshi@gmail.com",
        password: "TeamProjenius@25"
      },
      {
        name: "Hari Haran",
        phone: "6385326324",
        email: "projenius.iotacademyhariharan@gmail.com",
        password: "TeamProjenius@25"
      },
      {
        name: "Kanimozhi",
        phone: "6379113752",
        email: "projenius.iotacademykani@gmail.com",
        password: "TeamProjenius@25"
      },
      {
        name: "Abhinandha",
        phone: "6383401080",
        email: "projenius.iotacademyabhi@gmail.com",
        password: "TeamProjenius@25"
      },
      {
        name: "Dineshkarthick",
        phone: "9894024934",
        email: "projenius.iotacademykarthi@gmail.com",
        password: "TeamProjenius@25"
      }
    ];

    for (const admin of admins) {
      const exists = await Admin.findOne({ phone: admin.phone });

      if (!exists) {
        await Admin.create(admin);
        console.log(`✅ Admin created: ${admin.phone}`);
      } else {
        console.log(`⚠️ Admin already exists: ${admin.phone}`);
      }
    }

    console.log("🎯 Admin setup completed");
    process.exit();

  })
  .catch(err => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });
