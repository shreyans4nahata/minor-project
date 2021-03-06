var mysql = require('mysql');
//var config = require('../config');
var async = require('async');
var cfg = require('../config');
var _ = require('lodash');

var connection = mysql.createConnection(cfg.mysql);

connection.connect(function(err){
	if(err)
		console.log(err);
});


function fetchquestions(param,cb)
{
	//param = parseInt(param);
	console.log(param);
	var query = "select * from questions where tag_id = "+param+";"
	connection.query(query,function(err,rows){
		if(err){
			console.log(err);
			cb(err,null);
		}
		else{
			question_list = [];
			i=0;
			while(i<rows.length ){
                var details={
                	id :rows[i].id,
                    u_id:rows[i].u_id,
                    tag_id:rows[i].tag_id,
                    content:rows[i].content,
                    upvote:rows[i].upvote,
                    downvote:rows[i].downvote,
                    col_id:rows[i].col_id
                };
				question_list.push(details);
				i++;
		}
		cb(null,_.uniq(question_list));
	}
});
}


function storequestions(param,cb)
{
	console.log(param);
	var query = "Insert into questions values (?,?,?,?,?,?,?);"
	var uid = "select id from user where id = '"+(param.u_id)+"';"
	var tagid = "select id from tags where id = '"+(param.tag_id)+"';"
	var colid = "select id from college where id = '" +(param.col_id)+"';"

	async.waterfall([
		function(callback)
		{
			connection.query(tagid,function(err,rows){
				if(err)
				{
					console.log("error");
					cb(null,err);
					return callback(err)
				}
				else{
					console.log("tagid done");
					var tag= rows[0].id;
					callback(null,tag);
				}
			});
		},
		function(tag,callback)
		{
			connection.query(uid,function(err,rows){
				if(err)
				{
					console.log("error");
					cb(null,err);
					return callback(err)
				}
				else{
					console.log("uid done");
					var u= rows[0].id;
					callback(null,u,tag);
				}
			});
		},

		function(u,tag,callback)
		{
			connection.query(colid,function(err,rows){
				if(err)
				{
					console.log("error");
					cb(null,err);
					return callback(err)
				}
				else{
					console.log("colid done");
					var col= rows[0].id;
					callback(null,col,u,tag);
				}
			});
		},
		function(col,u,tag,callback)
		{
			var values =[0,u,tag,param.contents,0,0,col];
			connection.query(query,values,function(err,rows){
				if(err)
				{
					console.log(err);
					cb(null,err);
					return callback(err)
				}
				else{
					cb(rows[0]);
				}
			});
		}
         ],
		function(err)
		{
			if(err)
				return err;
		});

}

module.exports={
	storequestions :storequestions,
	fetchquestions  :fetchquestions
}