const Inspection = require("../models/inspectionModel");

module.exports = {
  async allComplete() {
    const inspections = await Inspection.find({});
    for (const inspection of inspections) {
      if (!inspection.completed) return false;
    }
    return true;
  },
  async resetInspections() {
    const inspections = await Inspection.find({});
    for (const inspection of inspections) {
      inspection.completed = false;
      await inspection.save();
    }
  },
};
