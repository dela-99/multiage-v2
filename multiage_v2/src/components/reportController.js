const Transaction = require("../models/Transaction");
const Project = require("../models/Project");
const User = require("../models/User");

const getRevenueReport = async (req, res, next) => {
  try {
    const { startDate, endDate, service } = req.query;
    const match = { type: "Revenue", status: "Paid" };

    if (startDate && endDate) {
      match.transactionDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const revenueByService = await Transaction.aggregate([
      { $match: match },
      {
        $lookup: { from: "projects", localField: "project", foreignField: "_id", as: "projectInfo" },
      },
      { $unwind: "$projectInfo" },
      {
        $group: {
          _id: "$projectInfo.requestedService",
          totalRevenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json(revenueByService);
  } catch (error) {
    next(error);
  }
};

const getProjectReport = async (req, res, next) => {
  try {
    const projectStatusReport = await Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(projectStatusReport);
  } catch (error) {
    next(error);
  }
};

const getStaffPerformanceReport = async (req, res, next) => {
  try {
    const staffPerformance = await Project.aggregate([
      { $match: { status: "Completed" } },
      { $unwind: "$assignedStaff" },
      { $group: { _id: "$assignedStaff", completedProjects: { $sum: 1 } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "staffInfo" } },
      { $unwind: "$staffInfo" },
      { $project: { "staffInfo.password": 0, "staffInfo.resetPasswordToken": 0 } },
      { $sort: { completedProjects: -1 } },
    ]);
    res.json(staffPerformance);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRevenueReport, getProjectReport, getStaffPerformanceReport };