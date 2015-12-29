


module.exports = {
    getUserId: function(sessionId, cb){
        //for local login checking, we need sessionId stored at client mobile, sessionId may expiredAt in due time
        if(sessionId){  
            sessions.findOne({id: sessionId}).exec(function(err, doc){
                if (err) {
                    cb(err);
                    return;
                }
                if(doc==null){
                    cb(null, null);
                    return;
                }
                var session2 = JSON.parse(doc.session);
                var userId = session2.user;
                AppUser.findOne({id: userId}).exec(function(err, appUserFound){
                    if (err) {
                        cb(err);
                        return;
                    }
                    if(!appUserFound){
                        cb(null, null);
                        return;
                    }
                    cb(null, appUserFound.id); //hardcode
                    return;

                });                
            });
        }
    }
    
    
    
}