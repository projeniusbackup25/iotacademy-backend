const User = require("../models/User");
const Order = require("../models/Order");
const ProjectSubmission = require("../models/ProjectSubmission");

exports.getDashboardReports = async (req, res) => {

  try {

    /* ---------------------------
       TOTAL REGISTRATIONS
    --------------------------- */
    const totalRegistrations = await User.countDocuments();


    /* ---------------------------
       TOTAL COURSES
    --------------------------- */
    const totalCourses = 3;


    /* ---------------------------
       TOTAL REVENUE
    --------------------------- */
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "success" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    const totalRevenue = revenueResult.length
      ? revenueResult[0].totalRevenue
      : 0;


    /* ---------------------------
       ACTIVE STUDENTS
    --------------------------- */
    const activeStudents = await Order.distinct("userId");

    const activeStudentCount = activeStudents.length;


    /* ---------------------------
       COMPLETED STUDENTS
    --------------------------- */
    const completedStudents = await ProjectSubmission.aggregate([
      {
        $group: {
          _id: "$userId",
          projectCount: { $sum: 1 }
        }
      },
      {
        $match: { projectCount: { $gte: 3 } }
      }
    ]);

    const completedStudentCount = completedStudents.length;


    /* ---------------------------
       COURSE LEVEL DISTRIBUTION
    --------------------------- */
    const levelStats = await User.aggregate([
      {
        $group: {
          _id: "$workshopKit",
          count: { $sum: 1 }
        }
      }
    ]);

    const levelDistribution = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };

    levelStats.forEach(level => {
      levelDistribution[level._id] = level.count;
    });


    /* ---------------------------
       FINAL RESPONSE
    --------------------------- */
    res.status(200).json({

      totalRegistrations,
      totalCourses,
      totalRevenue,
      activeStudents: activeStudentCount,
      completedStudents: completedStudentCount,
      levelDistribution

    });

  }

  catch (error) {

    console.error("REPORT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch reports"
    });

  }

};