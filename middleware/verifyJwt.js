import jwt from 'jsonwebtoken'

const verifyJwt = async (req, res, next) => {

  console.log("Inside 'verifyJwt' middleware")
  const { accessToken } = req.cookies

  if (!accessToken) {
    console.log('Access token not found')
    return res.json({ success: false, message: 'Access token not found' })
  }

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    )

    // console.log('before crash')
    if (!decodedToken) {
      console.log('Invalid token')
      return res.json({ success: false, message: 'Invalid Token' })
    }

    req.decodedToken = decodedToken
    next()
  } catch (err) {
    console.error('Token verification error:', err)
    return res.json({ success: false, message: 'Token Verificiation Error' })
  }
}

export default verifyJwt
