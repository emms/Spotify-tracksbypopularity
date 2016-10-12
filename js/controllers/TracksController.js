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
  self.ownPopular = [];
  self.tracknames = [];
  self.audio = new Audio();
  self.albumCoverSrc = '';


  self.getPlaylistTracks = function(playlist) {
    //console.log(playlist);
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
      self.tracknames = [];

      for (var i = 0; i < items.length; i++) {
        //console.log(items[i].track);
        items[i].track.playing = false;
        self.tracks.push(items[i].track);
        self.tracknames.push(items[i].track.name);
        self.getTrackPopularity(items[i].track.id);
      }

      var interval = setInterval(function() {
        if (self.popularities.length === self.tracks.length) {

          //console.log(self.popularities);
          for (var i = 0; i < items.length; i++) {
            //console.log(items[i].track);
            //self.tracks.push(items[i].track);

            if (self.tracks[i].name === self.popularities[i].name) {
              self.tracks[i].popularity = self.popularities[i].popularity;
            }
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
      var popularity = {};

      popularity.name = response.data.name;
      popularity.popularity = response.data.popularity;
      self.popularities.push(popularity);
      //console.log(popularity);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log('Soittolistojen haku ei onnistunut!');
    });
  };

  self.isInArray = function(value, array) {
    return array.indexOf(value) > -1;
  };

  self.seeTop = function() {
    if (self.ownPopular.length <= 0) {
      self.user = self.UserDetailsService.getUser();
      self.accessToken = self.UserDetailsService.getAccessToken();
      $http({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + self.accessToken
        },
      }).then(function successCallback(response) {
        var items = response.data.items;
        for (var i = 0; i < items.length; i++) {
          //console.log(items[i].track);
          items[i].playing = false;
          self.ownPopular.push(items[i]);
        }
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log('top trackien haku ei onnistunut!');
      });
    }
    var interval = setInterval(function() {
      if (self.ownPopular.length !== 0) {
        self.ownPopularInPlaylist = [];

        for (var a = 0; a < self.ownPopular.length; a++) {
          if (self.isInArray(self.ownPopular[a].name, self.tracknames)) {
            self.ownPopularInPlaylist.push(self.ownPopular[a]);
          }
        }
        //console.log(self.ownPopularInPlaylist);
        var notracks = { 'name': 'None of the tracks on this playlist are included in your 50 most played tracks.' };
        if (self.ownPopularInPlaylist.length === 0) {
          self.ownPopularInPlaylist.push(notracks);
        }
        self.tracks = [];
        self.tracks = self.ownPopularInPlaylist;
        clearInterval(interval);
        $scope.$apply();
      }
    }, 50);

  };

  self.playTrack = function(track) {
    if (!track.preview_url) {
      alert('This track is not available for preview.');
    } else {
      for (var i = 0; i < self.tracks.length; i++) {
        self.tracks[i].playing = false;
      }
      //console.log(self.tracks);
      if (!self.audio.paused && self.audio.src === track.preview_url) {
        self.audio.pause();
      } else {
        if (self.audio.src !== track.preview_url) {
          self.audio.src = track.preview_url;
          track.playing = true;
        }
        self.audio.play();
        self.albumCoverSrc = track.album.images[0].url;
        self.audio.onended = function() {
          track.playing = false;
          $scope.$apply();
        };
      }
    }
  };

}]);
