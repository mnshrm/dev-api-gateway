const sendToken = (cdt, statusCode, res) => {
  const token = cdt.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    cdt,
  });
};

module.exports = sendToken;
