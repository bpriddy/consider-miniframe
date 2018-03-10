const fs = require('fs')
const request = require('request')
const path = require('path')
const template = require('es6-template-strings');


const accessToken = fs.readFileSync(path.resolve(__dirname, `../.access_token`), 'utf8')
const endpoint = 'https://api.dialogflow.com/v1/${type}?v=20150910'

let syncObj = {
	intents:null,
	entities:null
};

module.exports = () => {
	
	get('intents')
		.then(save)
		.then(()=>{return get('entities')})
		.then(save)
		.then(match)
}

const get = (type)=> {
	let ep = template(endpoint, {type:type})
	return new Promise((resolve, reject) => {
		let opts = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			json: true,
		}
		request.get(ep, opts, 
			(err, res, body) => {
				if(err) return reject(err)
				if(body.status && body.status.code !== 200){
					reject({type:type,json:body})
				}else {
					resolve({type:type,json:body})
				}
			}
		)
	})
}

const save = (obj) => {
	return new Promise((resolve, reject) => {
		syncObj[obj.type] = obj.json
		resolve()
	})
}

const match = () => {
	console.log(syncObj)
	syncObj.intents.forEach((i) => {console.log(i)})
}

