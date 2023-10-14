const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/save_fortune_tarot_read', async function(req, res){
	try{
		var data = req.body;
		fs.writeFileSync(__dirname + `/../cms/db/tarot_read_${data.fortune_key}.json`, JSON.stringify(data.tarot_read_list));
		res.send({
			ok: 1
		});
	}catch(err){
		console.error(err);
		res.send({
			ok:0,
			err:'Fail /save_fortune_tarot_read'
		});
	}
});
router.get('/get_base_data', async function(req, res){
	try{
		var fortune_list_str = fs.readFileSync(__dirname + '/../cms/db/fortune_list.json', 'utf-8');
		var fortune_sub_question_list_str = fs.readFileSync(__dirname + '/../cms/db/fortune_sub_question_list.json', 'utf-8');
		var tarot_card_list_str = fs.readFileSync(__dirname + '/../cms/db/tarot_card_list.json', 'utf-8');
		res.send({
			ok: 1,
			fortune_list: JSON.parse(fortune_list_str),
			fortune_sub_question_list: JSON.parse(fortune_sub_question_list_str),
			tarot_card_list: JSON.parse(tarot_card_list_str)
		});
	}catch(err){
		console.error(err);
		res.send({
			ok:0,
			err:'Fail /get_base_data'
		});
	}
});
router.post('/get_tarot_read_list', async function(req, res){
	try{
		var fortune_key = req.body.fortune_key;
		var tarot_read_list_str = fs.readFileSync(__dirname + `/../cms/db/tarot_read_${fortune_key}.json`, 'utf-8');
		res.send({
			ok: 1,
			tarot_read_list: JSON.parse(tarot_read_list_str)
		});
	}catch(err){
		console.error(err);
		res.send({
			ok:0,
			err:'Fail /get_base_data'
		});
	}
});
router.post('/save_fortune_list', async function(req, res){
	try{
		var data = req.body;
		fs.writeFileSync(__dirname + `/../cms/db/fortune_list.json`, JSON.stringify(data));
		res.send({
			ok: 1
		});
	}catch(err){
		console.error(err);
		res.send({
			ok:0,
			err:'Fail /save_fortune_list'
		});
	}
});
router.post('/save_sub_question_list', async function(req, res){
	try{
		var data = req.body;
		fs.writeFileSync(__dirname + `/../cms/db/fortune_sub_question_list.json`, JSON.stringify(data));
		res.send({
			ok: 1
		});
	}catch(err){
		console.error(err);
		res.send({
			ok:0,
			err:'Fail /save_sub_question_list'
		});
	}
});
router.post('/delete_sub_question_file', async function(req, res){
	try{
		var fortune_key = req.body.fortune_key;
		var question_index = req.body.fortune_key;
		fs.unlinkSync(__dirname + `/../cms/db/tarot_read_${fortune_key}-${question_index}.json`);
		res.send({
			ok: 1
		});
	}catch(err){
		console.error(err);
		res.send({
			ok:0,
			err:'Fail /save_sub_question_list'
		});
	}
});


module.exports = router;