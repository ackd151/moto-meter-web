function compareTasks(a, b) {
  return a.remainingHours > b.remainingHours
    ? 1
    : a.remainingHours < b.remainingHours
    ? -1
    : 0;
}

module.exports = compareTasks;
