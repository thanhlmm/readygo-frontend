module.exports = {
  privated: (req, res, next) => {
    if (!req.user.sdt) {
      res.json({
        error: 'You need token to access this routes'
      });
    } else {
      next();
    }
  }
}