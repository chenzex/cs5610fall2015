'use strict';
(function () {
    angular
        .module("LiveTuition")
        .controller("LobbyController", LobbyController);
    function LobbyController($scope, $rootScope, $location) {
        var model = this;
        model.edit = edit;
		model.enter = enter;
       
        function edit() {
           $location.path('/profile');
        }
		
		function enter(){
            var fun = function (user) {
                //$rootScope.user = user;
            };
            $rootScope.user.name = $rootScope.user.username;
            var user = $rootScope.user;
            var msg = {
                type: 'guestLogin',
                user: {
                    name: $rootScope.user.name
                },
                callback: fun
            }
            // $rootScope.user = msg.user;
            $rootScope.socket.emit('user', msg);
			$location.path('/classroom');
		}
    }
})();
