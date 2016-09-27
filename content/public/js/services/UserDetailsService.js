spotifyApp.factory('UserDetailsService', function() {
    var user = { // TODO: MOCKUP
        name: '',
        id: '',
    };
    var accessToken = '';

    return {
        initUser: function(userData) {
            user.name = userData.name;
            user.id = userData.id;
            console.log(user);
        },

        getUser: function() {
            return user;
        },
        initAccessToken: function(token) {
            accessToken = token;
        },
        getAccessToken: function() {
            return accessToken;
        }
    };
});
