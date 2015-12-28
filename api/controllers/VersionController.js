/**
 * VersionController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//Kit
module.exports = {
	getVersion: function (req, res) {
		var device = req.param('device');
		if (!device || (device!='ios' && device!='android')) {
			res.status(400);
			res.json({message: 'invalid input'});
		};
		var versionInfo = {
			android : {
			code : 1,
			version : 2,
			versions_string : '0.1.1',
			version_date: '2015-08-27',
			link: 'http://api.maximitymacau.com/DuobaojieDemo_V1.9.5.apk'
		},
			ios : {
			code : 1,
			version : 2,
			versions_string : '0.1.1',
			version_date : '2015-08-27',
			link : 'itms-apps://itunes.apple.com/mo/app/chrome/id535886823?l=zh&mt=8'
		}
		}
		res.json(versionInfo[device]);
	}
};
//Kit end