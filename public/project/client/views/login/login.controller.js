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
                    $rootScope.user = user;
                    $rootScope.inClassroom = true;
                    $location.path('/lobby')
                });
        }
        
        
        // $rootScope.socket = io.connect("https://live-chenze.rhcloud.com:8443");
        $rootScope.socket = io.connect("localhost:3000");
        
        $rootScope.socket.on('user', function (msg) {
            if (msg.type == 'refresh') {
                if($rootScope.user == null)return;
                 $rootScope.$apply(function () {
                $rootScope.onlineUsers = msg.onlineUsers;
                delete $rootScope.onlineUsers[$rootScope.user.connId];
            });

            } else if (msg.type == 'login') {
                $rootScope.user.connId = msg.connId;
                 $rootScope.$apply(function () {
                $rootScope.onlineUsers = msg.onlineUsers;
                delete $rootScope.onlineUsers[$rootScope.user.connId];
            });
            } else if (msg.type == 'request') {
                BootstrapDialog.show({
                    title: 'Tuition Request',
                    message: msg.sourceUser.name + ' is asking you to join the tuition.',
                    buttons: [{
                        label: 'Accept',
                        action: function (dialog) {
                            $rootScope.user.targetId = msg.sourceId;
                            var msg2 = {
                                type: 'group',
                                sourceUser: $rootScope.user,
                                targetUser: msg.sourceuser,
                                targetId: msg.sourceId
                            }
                            $rootScope.socket.emit('user', msg2);
                            document.getElementById('userContainer').style.display = "none";
                            document.getElementById('chatContainer').style.display = "block";
                            dialog.close();
                        }
                    }, {
                            label: 'Cancel',
                            action: function (dialog) {
                                dialog.close();
                            }
                        }]
                });
            } else if (msg.type == 'group') {
                $rootScope.user.targetId = msg.targetId;
                document.getElementById('userContainer').style.display = "none";
                document.getElementById('chatContainer').style.display = "block";
            }
        });


        $scope.guestLogin = function () {
            var fun = function (user) {
                //$rootScope.user = user;
            };
            var msg = {
                type: 'guestLogin',
                user: {
                    name: $scope.guest
                },
                callback: fun
            }
            $rootScope.user = msg.user;
            $rootScope.socket.emit('user', msg);
            $rootScope.inClassroom = true;
            $location.path('/classroom');
        }
    }
})();
