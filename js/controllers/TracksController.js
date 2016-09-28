spotifyApp.controller('TracksController', ['$http', '$scope', 'UserDetailsService', function($http, $scope, UserDetailsService) {
    var self = this;
    self.UserDetailsService = UserDetailsService;
    self.accessToken = '';
    self.user = {};
    self.tracks = [];
    self.popularities = [];
    self.showPlaylistTracks = false;
    self.sortType = 'popularity'; // set the default sort type
    self.sortReverse = true;

    self.getPlaylistTracks = function(playlist) {
        console.log(playlist);
        self.user = self.UserDetailsService.getUser();
        self.accessToken = self.UserDetailsService.getAccessToken();


        $http({
            method: 'GET',
            url: 'https://api.spotify.com/v1/users/' + self.user.id + '/playlists/' + playlist.id + '/tracks',
            headers: {
                'Authorization': 'Bearer ' + self.accessToken
            },
        }).then(function successCallback(response) {
            var items = response.data.items;
            self.tracks = [];

            for (var i = 0; i < items.length; i++) {
                //console.log(items[i].track);
                self.tracks.push(items[i].track);
                self.getTrackPopularity(items[i].track.id);
            }

            var interval = setInterval(function() {
                if (self.popularities.length === self.tracks.length) {

                    console.log(self.popularities);
                    for (var i = 0; i < items.length; i++) {
                        //console.log(items[i].track);
                        //self.tracks.push(items[i].track);
                        self.tracks[i].popularity = self.popularities[i];
                        //console.log(items[i].track);
                        //items[i].track.popularity = self.getTrackPopularity(items[i].track.id);
                    }
                    self.showPlaylistTracks = true;
                    clearInterval(interval);
                    $scope.$apply();

                }
            }, 50);


            //console.log(response.items);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Soittolistojen haku ei onnistunut!');
        });
    };

    self.getTrackPopularity = function(trackId) {
        $http({
            method: 'GET',
            url: 'https://api.spotify.com/v1/tracks/' + trackId,
            headers: {
                'Authorization': 'Bearer ' + self.accessToken
            },
        }).then(function successCallback(response) {
            self.popularities.push(response.data.popularity);
            //console.log(response.items);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Soittolistojen haku ei onnistunut!');
        });
    };


}]);
