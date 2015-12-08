'use strict';
(function () {
    angular
        .module("LiveTuition")
        .controller("ProfileController", ProfileController);
    function ProfileController($scope, UserService, $rootScope, $location) {
        var model = this;
        model.update = update;
        model.back = back;
        if ($rootScope.user != null) {
            model.username = $rootScope.user.username;
            model.password = $rootScope.user.password;
            model.firstName = $rootScope.user.firstName;
            model.lastName = $rootScope.user.lastName;
            model.email = $rootScope.user.email;
            model.phone = $rootScope.user.phone;
            model.school = $rootScope.user.school;
            model.major = $rootScope.user.major;
            model.grade = $rootScope.user.grade;
        }
        function update() {
            var id = $rootScope.user.id;
            var user = $rootScope.user;
            user.username = $rootScope.user.username;
            user.password = $rootScope.user.password;
            user.firstName = model.firstName;
            user.lastName = model.lastName;
            user.email = model.email;
            user.phone = model.phone;
            user.school = model.school;
            user.major = model.major;
            user.grade = model.grade;

            UserService
                .updateUser(id, user)
                .then(function (user) {
                    $rootScope.user = user;
                    model.username = $rootScope.user.username;
                    model.password = $rootScope.user.password;
                    model.firstName = $rootScope.user.firstName;
                    model.lastName = $rootScope.user.lastName;
                    model.email = $rootScope.user.email;
                    model.phone = $rootScope.user.phone;
                    model.school = $rootScope.user.school;
                    model.major = $rootScope.user.major;
                    model.grade = $rootScope.user.grade;
                    BootstrapDialog.show({
                        title: 'Scuccess',
                        message: 'Information Updated',
                        buttons: [{label: 'OK',
                                action: function (dialog) {
                                    dialog.close();
                                }
                            }]
                    });
                    $rootScope.inClassroom = false;
                });
        }

        function back() {
            $location.path('/lobby');
            $rootScope.inClassroom = false;
        }
    }
})();
