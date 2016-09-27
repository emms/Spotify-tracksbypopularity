spotifyApp.controller('LoginController', ['$http', 'UserDetailsService', function($http, UserDetailsService) {
    var self = this;
    self.loggedIn = false;
    self.showLogin = true;
    self.user = {};
    self.UserDetailsService = UserDetailsService;

    self.getHashParams = function() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(2);
        //substring(2) to get rid of / that ng-include adds
        //console.log(q);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    };

    var params = self.getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {

            $http({
                method: 'GET',
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
            }).then(function successCallback(response) {
                self.showLogin = false;
                self.loggedIn = true;
                console.log(response);
                console.log(self.loggedIn);
                self.user = response.data;
                self.UserDetailsService.initUser({
                    name: self.user.display_name,
                    id: self.user.id,
                });
                self.UserDetailsService.initAccessToken(access_token);
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('Käyttäjän haku ei onnistunut!');
            });


        }
    }

}]);
