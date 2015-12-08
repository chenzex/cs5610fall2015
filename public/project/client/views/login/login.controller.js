'use strict';
(function () {
    angular
        .module("LiveTuition")
        .controller("LoginController", LoginController);
    function LoginController($scope, UserService, $rootScope, $location) {
        var model = this;
        model.login = login;
        function login() {
            UserService
                .login(model.username, model.password)
                .then(function (user) {
                    if (user == 'error'){
                        BootstrapDialog.show({
                        title: 'unauthorized',
                        message: 'Incorrect username or password',
                        buttons: [{label: 'OK',
                                action: function (dialog) {
                                    dialog.close();
                                }
                            }]
                    });
                    return;
                    }
                    $rootScope.isGuest=false;
                    $rootScope.user = user;
                    $rootScope.inClassroom = false;
                    $location.path('/lobby')
                });
        }
        
        
        // $rootScope.socket = io.connect("https://live-chenze.rhcloud.com:8443");
        // $rootScope.socket = io.connect("localhost:3000");
        
        


        $scope.guestLogin = function () {
            // var fun = function (user) {
            //     //$rootScope.user = user;
            // };
            // var msg = {
            //     type: 'guestLogin',
            //     user: {
            //         name: $scope.guest
            //     },
            //     callback: fun
            // }
            $rootScope.isGuest=true;
            $rootScope.user = {name:$scope.guest}
            // $rootScope.socket.emit('user', msg);
            // $rootScope.inClassroom = true;
            $location.path('/classroom');
        }
    }
})();
