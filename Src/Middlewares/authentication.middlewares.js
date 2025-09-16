import BlackListedToken from './../DB/Models/black-listed.model.js';
import User from './../DB/Models/user.model.js';
import { verifyToken } from '../Utils/tokens.utils.js';
import Active from '../DB/Models/active.model.js';

export const authenticationMiddlewares = async (req, res, next) => {
    const { accesstoken } = req.headers
    if (!accesstoken) {
        return res.status(400).json({ message: "please provide an access token" })
    }
    const decodedData = verifyToken(accesstoken, process.env.JWT_ACCESS_SECRET)
    if (!decodedData?.jti) {
        return res.status(400).json({ message: "invaild token" })
    }

    const blackListedToken = await BlackListedToken.findOne({ tokenId: decodedData.jti })
    if (blackListedToken) {
        return res.status(400).json({ message: "Token is blackListed" })
    }

    const activeSession = await Active.findOne({ tokenId: decodedData.jti });
    if (!activeSession) {
      return res.status(401).json({ message: "Session expired or removed" });
    }

    const user = await User.findById(decodedData?._id)
    if (!user) {
        return res.status(400).json({ message: "user not found" })
    }

    req.loggedInUser = { user, token: { tokenId: decodedData.jti, expirationDate: decodedData.exp } }

    next()
}