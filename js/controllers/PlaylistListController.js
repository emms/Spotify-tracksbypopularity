spotifyApp.controller('PlaylistListController', ['$http', 'UserDetailsService', function($http, UserDetailsService) {
    var self = this;
    self.UserDetailsService = UserDetailsService;
    self.playlists = [];
    self.user = {};
    self.accessToken = '';
    self.selectedIndex = '';

    self.getMyPlaylists = function() {
        self.user = self.UserDetailsService.getUser();
        self.accessToken = self.UserDetailsService.getAccessToken();

        $http({
            method: 'GET',
            url: 'https://api.spotify.com/v1/users/' + self.user.id + '/playlists',
            headers: {
                'Authorization': 'Bearer ' + self.accessToken
            },
        }).then(function successCallback(response) {
            var items = response.data.items;
            for (var i = 0; i < items.length; i++) {
                self.playlists.push(items[i]);
            }
            //console.log(response.items);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Soittolistojen haku ei onnistunut!');
        });
    };

    self.selectPlaylist = function(index) {
        self.selectedIndex = index;
    };

}]);
