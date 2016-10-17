var express = require('express');
var router = express.Router();
var tags = require('../models/tags');

/**
* @api {get} /tags/:  request to get all the tags
*@apiName tags
 * @apiGroup comment
 *
 *@apiSuccess {number} id .
 *@apiSucess  {string} name of the tags
*/ 

router.get('/',function(req,res,next){
	tags.fetchtags(function(err,tags){
		if(err)
		{
			console.log("error hai ");
			res.json({error:err});
		}
		else
			res.json({TAGS:tags});
	});

});

module.exports = router;
