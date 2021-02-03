const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { Sequelize } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Interest,Value,Feed,Connection,Post,Comment, } = require('../../db/models');

const router = express.Router();

router.post(
    '/:requestingUserId/:requestedUserId',
    requireAuth,
    asyncHandler(async (req, res) => {
          const {requestingUserId, requestedUserId} = req.params
          const {warm_up_response} = req.body
          const newConnection = await Connection.create({requestedUserId,requestingUserId,warm_up_response,accepted:false})
          
          const userWithProfileData = await User.findByPk(requestingUserId,
            {
              include: [ 
                  {model: Value,where:{userId:requestingUserId}},
                  {model:Interest,where:{userId:requestingUserId}},
                  {model:Feed,where:{userId:requestingUserId},include: [{model: Post,include:[{model: Comment}]}]},
                  {model:Connection,where:{accepted:true}},      
              ]}) 
      
      return res.json({
        userWithProfileData
      });
    })
  );

  router.post(
    '/act/:connectionId',
    requireAuth,
    asyncHandler(async (req, res) => {
        const {connectionId} = req.params
        const {approvedStatus} = req.body
        if (approvedStatus === true) {
            const updatedConnection = await Connection.findByPk(connectionId)
            updatedConnection.accepted = true
            await updatedConnection.save()
        } else {
            const connectionToDestroy = await Connection.findByPk(connectionId)
            await connectionToDestroy.destroy()
        }

          const userWithProfileData = await User.findByPk(requestingUserId,
            {
              include: [ 
                  {model: Value,where:{userId:requestingUserId}},
                  {model:Interest,where:{userId:requestingUserId}},
                  {model:Feed,where:{userId:requestingUserId},include: [{model: Post,include:[{model: Comment}]}]},
                  {model:Connection,where:{accepted:true},required:false},      
                ]}) 
      
      return res.json({
        userWithProfileData
      });
    })
  );


module.exports = router;
