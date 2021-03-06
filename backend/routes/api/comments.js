const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Interest,Value,Feed,Comment,Connection,Post } = require('../../db/models');

const router = express.Router();

router.post(
    '/:postId/:userId/',
    requireAuth,
    asyncHandler(async (req, res) => {
      const {commentText} = req.body;
      
      const {postId,userId} = req.params
    //   const feed = await Feed.findByPk(feedId)
    //   console.log(feed,"_________________________________________________________________")
    //   const canPost = await Connection.findOne({where:{[Op.and]: [{requestedUser:{[Op.or]:[userId,feed.userId]}},{requestingUser:{[Op.or]:[userId,feed.userId]}}]}})
    //   console.log("_______________________/",canPost,"________________________")
    //   if (canPost) {
        const newComment = await Comment.create({postId,userId,commentText}) 
        
    //   } else {
        
        const userWithProfileData = await User.findByPk(userId,
          {
            include: [ 
                {model: Value,where:{userId:userId}},
                {model:Interest,where:{userId:userId}},
                {model:Feed,where:{userId:userId},include: [{model: Post,include:[{model:User},{model: Comment,include:[{model:User}]}]}]},
                {model:Connection,as: "Requests",where:{accepted:false,requestedUser:userId},required:false,include:[{model:User}]},
                {model:Connection,as: "Network",where:{accepted:true, [Sequelize.Op.or]: [{requestedUser:userId},{requestingUser:userId}]},required:false,include:[{model:User}]}
                  // ,required:false,include: [
              //     {model:Feed,where:{userId:userId},include: [{model: Post,required:false,include:[{model: Comment,required:false,include:[{model:User}]}]}]}]}]}             
            ]
          }
        )
    
                return res.json({
                    userWithProfileData,
                    // "message":"You can't post on this feed."
                  });
    //   }



//       const userWithProfileData = await User.findByPk(userId,
//         {
//           include: [ 
//               {model: Value,where:{userId:userId}},
//               {model:Interest,where:{userId:userId}},
//               {model:Feed,where:{userId:userId},include: [{model: Post,include:[{model: Comment}]}]},
//               {model:Connection,as: "Requests",where:{accepted:false,requestedUser:userId},required:false},
//               {model:Connection,as: "Network",where:{accepted:true},required:false}               ]})
//       await setTokenCookie(res, user);
//       // console.log(user,"USER CREATE___________________")
//       console.log(userWithProfileData, "USERWITHPROFILEDATA___________________________")
      
//       return res.json({
//         userWithProfileData
//       });
    })
  );




module.exports = router;
