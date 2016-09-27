spotifyApp.controller('MainController', ['$scope', '$http', 'UserDetailsService', function($scope, $http, UserDetailsService) {
    var self = this;
    self.UserDetailsService = UserDetailsService;
    self.userIsLoggedIn = false;
    self.displayTracks = false;

    self.showPlaylists = function() {
        if (self.UserDetailsService.getUser().name !== '') {
            return true;
        }
        return false;
    };

    self.showTracks = function() {
    	
    };


}]);
