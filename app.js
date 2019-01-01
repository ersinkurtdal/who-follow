const fs = require('fs'); // https://nodejs.org/api/fs.html

const Twitter = require('twitter'); // https://github.com/desmondmorris/node-twitter

const config = {
	// application keys https://developer.twitter.com/en/apps
	keys:{
		consumer_key: '',
		consumer_secret: '',
		access_token_key: '',
		access_token_secret: '',
	},
	screen_name: '',
	notFriendsOutput: `${__dirname}/not-friends.json`,
	notFollowersOutput: `${__dirname}/not-followers.json`
};

const client = new Twitter(config.keys);

/**	
 * Twitter api query
 *
 * @param {string} queryString https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference
 * @param {object} params
 *
 * @return {object}
 */ 
const query = (queryString, params) => {
	return new Promise((resolve, reject) => {
		client.get(queryString, params, function(error, data, response) {
			if (error) return reject(error);
			resolve(data);
		});
	});
};

/**	
 * Calls query function by next_cursor
 * 
 * @param {string} queryString https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference
 * @param {object} params
 * @param {string} id = null
 *
 * @return {array} user ids array
 */ 
const getUserData = async (queryString, params, id = null) => {

	const data = [];
	let users = [];

	do{
		try{
			users = await query(queryString, params);
			data.push(...(id ? users[id] : users));
			params.cursor = users.next_cursor;
		}catch(e){
			console.error(e);
			break;
		}
	}while(typeof users.next_cursor !== 'undefined' && users.next_cursor);

	return data;
};

/**	
 * Gets user screen name and profile image url by Twitter ID
 * And writes it to output file in json format
 *
 * @param {array} users A comma separated list of user ids, up to 100 are allowed in a single request.
 * @param {string} output
 * 
 * @return void
 */ 
const getUsersInfo = async (users, output) => {

	const data = [],
		size = users.length;

	try{
		for (let i = 0; i < size; i+=100) {
			let slices = users.slice(i, i+100),
				result = await query('users/lookup', {user_id: slices.join()}),
				report = result.map(user => {
					return {screen_name: user.screen_name, profile_image: user.profile_image_url_https};
				});
			data.push(...report);
		}

		fs.writeFileSync(output, JSON.stringify(data, null, 4));
		console.info(`${data.length} user${data.length > 1 ? 's' : ''} information saved in ${output}`);
	}catch(e){
		console.error(e);
	}
};

// the main function
(async () => {

	const params = {screen_name: config.screen_name};

	// get followers and friends IDs
	let followers = await getUserData('followers/ids', params, 'ids');
	let friends = await getUserData('friends/ids', params, 'ids');

	// gets user data by ID's that according to filters and saves it the output file
	if(followers && followers.length && friends && friends.length){
		await getUsersInfo(followers.filter(id => !friends.includes(id)), config.notFriendsOutput);
		await getUsersInfo(friends.filter(id => !followers.includes(id)), config.notFollowersOutput);
	}

})();