'use strict';
(function () {
    angular
        .module("LiveTuition")
        .controller("ClassroomController", ClassroomController);


    function ClassroomController($scope, $rootScope, $location) {
        var model = this;
        $rootScope.inClassroom = true;
        model.messages = [];
        if ($rootScope.socket == null)
            $rootScope.socket = io.connect("https://live-chenze.rhcloud.com:8443");
            // $rootScope.socket = io.connect("localhost:3000");
         else
            $rootScope.socket.connect();
        
        // handle socket.io messages
        $rootScope.socket.on('chat', function (chat) {
            chat.self = false;
            model.chatGenerator(chat);
        });

        $rootScope.socket.on('trace', function (trace) {
            model.draw(trace);
        });

        $rootScope.socket.on('webrtc', function (msg) {
            model.connect(msg);
        });

        $rootScope.socket.on('user', function (msg) {
            if (msg.type == 'refresh') {
                if ($rootScope.user == null) return;
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

        var msg = {
            type: 'guestLogin',
            user: {
                name: $rootScope.user.name
            },
            callback: null
        }

        $rootScope.socket.emit('user', msg);

        model.sendMsg = function () {
            model.chatGenerator(model.chatInput);
            var msg2 = {
                targetId: $rootScope.user.targetId,
                content: model.chatInput
            }
            $rootScope.socket.emit('chat', msg2);
            model.chatInput = "";
        };

        model.sendTrace = function (trace) {
            if ($rootScope.user.targetId == null) return;
            trace.targetId = $rootScope.user.targetId;
            $rootScope.socket.emit('trace', trace);
        }






        $(function () {
            

            // init blackboard block
            var canvas = $('#board');
            model.ctx1 = canvas[0].getContext("2d");
            model.ctx1.lineJoin = model.ctx1.lineCap = 'round';
            model.ctx2 = $('#board2')[0].getContext("2d");
            model.ctx2.lineJoin = model.ctx2.lineCap = 'round';
            model.ctx3 = $('#board3')[0].getContext("2d");
            model.ctx3.lineJoin = model.ctx3.lineCap = 'round';

            $('#thickness').slider({
                formatter: function (value) {
                    model.ctx1.lineWidth = value;
                    return 'Current value: ' + value;
                }
            });

            $(".toolbar-btn").mouseup(function () {
                $(this).blur();
            })


            // Define 4 tools
            var Pencil, Rect, Line, Eraser;
            var tools = {
                pencil: Pencil = (function () {
                    function Pencil() {
                        //context.strokeStyle = chalk_color;
                        this.points = [];
                        this.started = false;
                    }
                    Pencil.prototype.mousedown = function (e) {
                        this.points.push({ x: e.x, y: e.y });
                        this.started = true;
                    };
                    Pencil.prototype.mousemove = function (e) {
                        if (this.started) {
                            model.ctx1.strokeStyle = model.color;

                            this.points.push({ x: e.x, y: e.y });

                            model.ctx1.clearRect(0, 0, model.ctx1.canvas.width, model.ctx1.canvas.height);

                            var p1 = this.points[0];
                            var p2 = this.points[1];

                            model.ctx1.beginPath();
                            model.ctx1.moveTo(p1.x, p1.y);
                            // console.log(this.points);
                            
                            
                            for (var i = 1, len = this.points.length; i < len; i++) {
                                var midPoint = {
                                    x: p1.x + (p2.x - p1.x) / 2,
                                    y: p1.y + (p2.y - p1.y) / 2
                                };
                                model.ctx1.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                                p1 = this.points[i];
                                p2 = this.points[i + 1];
                            }

                            model.ctx1.lineTo(p1.x, p1.y);
                            model.ctx1.stroke();


                            var trace = {
                                points: this.points,
                                type: e.type,
                                tool: 'pencil',
                                thickness: model.ctx1.lineWidth,
                                color: model.ctx1.strokeStyle,
                                targetId: $rootScope.user.targetId
                            };
                            model.sendTrace(trace);
                        }
                    };
                    Pencil.prototype.mouseup = function (e) {
                        if (this.started) {
                            this.points.length = 0;
                            this.started = false;
                            img_update();
                            var trace = {
                                type: 'mouseup',
                                targetId: $rootScope.user.targetId
                            };

                            model.sendTrace(trace);
                        }
                    };
                    Pencil.prototype.mouseleave = function (e) {
                        if (this.started) {
                            this.points.length = 0;
                            this.started = false;
                            img_update();
                            var trace = {
                                type: 'mouseup'
                            };
                            model.sendTrace(trace);
                        }
                    };
                    return Pencil;
                })(),
                rect: Rect = (function () {
                    function Rect() {
                        this.started = false;
                    }
                    Rect.prototype.mousedown = function (e) {
                        this.started = true;
                        this.x0 = e.x;
                        return this.y0 = e.y;
                    };
                    Rect.prototype.mousemove = function (e) {
                        var h, w, x, y;
                        if (!this.started) {
                            return;
                        }
                        x = Math.min(e.x, this.x0);
                        y = Math.min(e.y, this.y0);
                        w = Math.abs(e.x - this.x0);
                        h = Math.abs(e.y - this.y0);
                        model.ctx1.clearRect(0, 0, canvas[0].width, canvas[0].height);
                        if (!w || !h) {
                            return;
                        }
                        model.ctx1.strokeStyle = model.color;
                        model.ctx1.strokeRect(x, y, w, h);
                        var trace = {
                            x: x,
                            y: y,
                            w: w,
                            h: h,
                            type: e.type,
                            tool: 'rect',
                            thickness: model.ctx1.lineWidth,
                            color: model.ctx1.strokeStyle
                        }
                        model.sendTrace(trace);
                    };
                    Rect.prototype.mouseup = function (e) {
                        this.started = false;
                        img_update();
                        var trace = {
                            type: 'mouseup'
                        };
                        model.sendTrace(trace);
                    };
                    Rect.prototype.mouseleave = function (e) {
                    };
                    return Rect;
                })(),
                line: Line = (function () {
                    function Line() {
                        this.started = false;
                    }
                    Line.prototype.mousedown = function (e) {
                        this.started = true;
                        this.x0 = e.x;
                        return this.y0 = e.y;
                    };
                    Line.prototype.mousemove = function (e) {
                        if (!this.started) {
                            return;
                        }
                        model.ctx1.strokeStyle = model.color;
                        model.ctx1.clearRect(0, 0, canvas[0].width, canvas[0].height);
                        model.ctx1.beginPath();
                        model.ctx1.moveTo(this.x0, this.y0);
                        model.ctx1.lineTo(e.x, e.y);
                        model.ctx1.stroke();
                        model.ctx1.closePath();
                        var trace = {
                            x1: this.x0,
                            y1: this.y0,
                            x2: e.x,
                            y2: e.y,
                            type: e.type,
                            tool: 'line',
                            thickness: model.ctx1.lineWidth,
                            color: model.ctx1.strokeStyle
                        }
                        model.sendTrace(trace);
                    };
                    Line.prototype.mouseup = function (e) {
                        this.mousemove(e);
                        this.started = false;
                        img_update();
                        var trace = {
                            type: 'mouseup'
                        };
                        model.sendTrace(trace);
                    };
                    Line.prototype.mouseleave = function (e) {
                    };
                    return Line;
                })(),
                eraser: Eraser = (function () {
                    function Eraser() {
                        this.started = false;
                    }
                    Eraser.prototype.mousedown = function (e) {
                        model.ctx1.moveTo(e.x, e.y);
                        return this.started = true;
                    };
                    Eraser.prototype.mousemove = function (e) {
                        var hor_offset, ver_offset;
                        if (this.started) {
                            hor_offset = e.x - (model.ctx1.lineWidth + 5) / 2;
                            ver_offset = e.y - (model.ctx1.lineWidth + 5) / 2;
                            model.ctx3.clearRect(hor_offset, ver_offset, model.ctx1.lineWidth + 5, model.ctx1.lineWidth + 5);
                            var trace = {
                                x1: hor_offset,
                                y1: ver_offset,
                                x2: model.ctx1.lineWidth + 5,
                                y2: model.ctx1.lineWidth + 5,
                                type: e.type,
                                tool: 'eraser',
                                thickness: model.ctx1.lineWidth,
                                color: model.ctx1.strokeStyle
                            }
                            model.sendTrace(trace);
                        }
                    };
                    Eraser.prototype.mouseup = function (ev) {
                        if (this.started) {
                            this.started = false;
                            img_update();
                            var trace = {
                                type: 'mouseup'
                            };
                            model.sendTrace(trace);
                        }
                    };
                    Eraser.prototype.mouseleave = function (e) {
                    };
                    return Eraser;
                })()
            }

            var img_update = function () {
                model.ctx3.drawImage(canvas[0], 0, 0);
                model.ctx1.clearRect(0, 0, canvas[0].width, canvas[0].height);
            };
            var img_update2 = function () {
                model.ctx3.drawImage($('#board2')[0], 0, 0);
                model.ctx2.clearRect(0, 0, canvas[0].width, canvas[0].height);
            };

            model.tool = new tools['pencil']();
            model.tool2 = new tools['pencil']();
            model.color = '#000000';
            function ev_canvas(e) {
                e.x = e.pageX - $(this).offset().left;
                e.y = e.pageY - $(this).offset().top;
                model.tool[e.type](e);
            }

            canvas.mousedown(ev_canvas);
            canvas.mousemove(ev_canvas);
            canvas.mouseup(ev_canvas);
            canvas.mouseleave(ev_canvas);



            model.clear = function () {
                model.ctx3.clearRect(0, 0, model.ctx3.canvas.width, model.ctx3.canvas.height);
                var trace = {
                    tool: 'clear'
                }
                //$rootScope.socket.emit('trace', );
                model.sendTrace(trace);
            }

            model.draw = function (trace) {
                if (trace.type == 'mouseup') {
                    img_update2();
                }
                else if (trace.tool == 'pencil') {
                    model.ctx2.clearRect(0, 0, model.ctx2.canvas.width, model.ctx2.canvas.height);

                    var p1 = trace.points[0];
                    var p2 = trace.points[1];
                    model.ctx2.lineWidth = trace.thickness;
                    model.ctx2.strokeStyle = trace.color;
                    model.ctx2.beginPath();
                    model.ctx2.moveTo(p1.x, p1.y);
                    // console.log(this.points);
                            
                            
                    for (var i = 1, len = trace.points.length; i < len; i++) {
                        var midPoint = {
                            x: p1.x + (p2.x - p1.x) / 2,
                            y: p1.y + (p2.y - p1.y) / 2
                        };
                        model.ctx2.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                        // model.ctx1.lineTo(p2.x, p2.y);
                        // console.log(p2);
                        p1 = trace.points[i];
                        p2 = trace.points[i + 1];
                    }

                    model.ctx2.lineTo(p1.x, p1.y);
                    model.ctx2.stroke();

                } else if (trace.tool == 'rect') {
                    model.ctx2.lineWidth = trace.thickness;
                    model.ctx2.strokeStyle = trace.color;
                    model.ctx2.clearRect(0, 0, canvas[0].width, canvas[0].height);
                    model.ctx2.strokeRect(trace.x, trace.y, trace.w, trace.h);
                } else if (trace.tool == 'line') {
                    model.ctx2.lineWidth = trace.thickness;
                    model.ctx2.strokeStyle = trace.color;
                    model.ctx2.clearRect(0, 0, canvas[0].width, canvas[0].height);
                    model.ctx2.beginPath();
                    model.ctx2.moveTo(trace.x1, trace.y1);
                    model.ctx2.lineTo(trace.x2, trace.y2);
                    model.ctx2.stroke();
                    model.ctx2.closePath();
                } else if (trace.tool == 'eraser') {
                    model.ctx2.lineWidth = trace.thickness;
                    model.ctx3.clearRect(trace.x1, trace.y1, trace.x2, trace.y2);
                } else if (trace.tool == 'clear') {
                    model.ctx3.clearRect(0, 0, model.ctx3.canvas.width, model.ctx3.canvas.height);
                }
            }

            model.chatGenerator = function (chat) {
                var li = document.createElement("li");

                li.className += "clearfix";
                var span = document.createElement("span");
                span.className += "chat-img";

                var image = document.createElement("img");
                image.setAttribute("alt", "User Avatar");
                image.className += "img-circle";


                var div1 = document.createElement("div");
                div1.className += "chat-body clearfix";
                var div2 = document.createElement("div");
                div2.className += "header";

                var small = document.createElement("small");
                small.className += "text-muted";
                var span2 = document.createElement("span");
                span2.className += "glyphicon glyphicon-time";
                small.appendChild(span2);
                small.innerHTML += chat.time;

                var strong = document.createElement("strong");
                strong.className += "primary-font";
                strong.innerHTML += chat.sender;

                var p = document.createElement("p");
                p.innerHTML += chat.content;


                if (chat.self) {
                    li.className += " right";
                    span.className += " pull-right";
                    image.setAttribute("src", "http://placehold.it/50/FA6F57/fff&text=" + $rootScope.user.name.charAt(0));
                    strong.className += " pull-right";
                    // strong.className += " pull-right";
                    div2.appendChild(small);
                    div2.appendChild(strong);
                }
                else {
                    li.className += " left";
                    span.className += " pull-left";
                    image.setAttribute("src", "http://placehold.it/50/55C1E7/fff&text=" + chat.sender.charAt(0));
                    small.className += " pull-right";
                    div2.appendChild(strong);
                    div2.appendChild(small);
                }

                span.appendChild(image);

                div1.appendChild(div2);
                div1.appendChild(p);


                li.appendChild(span);
                li.appendChild(div1);
                document.getElementById("chatUl").appendChild(li);

                var panel = document.getElementById('chat-main-panel');
                panel.scrollTop = panel.scrollHeight;

            }
            var sendChat = function () {
                if ($('#btn-input').val() == "") return;
                var chat;
                chat = {
                    content: $('#btn-input').val(),
                    time: new Date().toLocaleTimeString(),
                    sender: $rootScope.user.name,
                    self: true,
                    targetId: $rootScope.user.targetId
                }
                $('#btn-input').val("");
                model.chatGenerator(chat);
                $rootScope.socket.emit('chat', chat);
            }
            $('#btn-chat').click(function () {
                sendChat();
            });

            var _myConnection, // My RTCPeerConnection instance
                _myMediaStream; // My MediaStream instance
                
            function sendOffer() {
                //mediaReady = false;
                //guestMediaReady = false;
                _myConnection.createOffer(function (desc) {
                    // Set the generated SDP to be our local session description
                    _myConnection.setLocalDescription(desc, function () {
                        // And send it to our peer, where it will become their RemoteDescription
                        //hub.server.webRtcSignal(JSON.stringify({ "sdp": desc }), GroupId);
                        var msg = {
                            type: 'webrtc',
                            content: JSON.stringify({ "sdp": desc }),
                            targetId: $rootScope.user.targetId
                        }
                        $rootScope.socket.emit('webrtc', msg);
                    });
                    console.log('sending offer');
                });
            };

            function _createConnection() {
                console.log('creating RTCPeerConnection...');
                var iceServers = {
                    "iceServers": [{
                        "url": "stun:stun.l.google.com:19302"
                    }, {
                            "url": "turn:numb.viagenie.ca",
                            "username": "webrtc@live.com",
                            "credential": "muazkh"
                        }]
                };


                var connection = new RTCPeerConnection(iceServers); // null = no ICE servers
                //connection.iceServers = extraIceServers;
                // A new ICE candidate was found
                connection.onicecandidate = function (event) {
                    if (event.candidate) {
                        // Let's send it to our peer via SignalR
                        //hub.server.webRtcSignal(JSON.stringify({ "candidate": event.candidate }), GroupId);(
                            
                        var msg = {
                            type: 'webrtc',
                            content: JSON.stringify({ "candidate": event.candidate }),
                            targetId: $rootScope.user.targetId
                        }
                        $rootScope.socket.emit('webrtc', msg);
                    }
                };

                // New remote media stream was added
                connection.onaddstream = function (event) {

                    document.getElementById('chat-main-panel').style.height = "170px";
                    document.getElementById('media2').style.display = "block";
                    var videoElement = document.querySelector('#media2');
                    attachMediaStream(videoElement, event.stream);
                    document.getElementById('videoSpan').className = "glyphicon glyphicon-off";
                };

                return connection;
            }




            model.connect = function (msg) {
                var msg2;
                if (msg == 'request') {
                    msg2 = {
                        type: 'request',
                        targetId: $rootScope.user.targetId,
                        name: $rootScope.user.name
                    }
                    $rootScope.socket.emit('webrtc', msg2);
                    console.log("send request");
                } else if (msg == 'close') {
                    msg2 = {
                        type: 'close',
                        targetId: $rootScope.user.targetId
                    }
                    $rootScope.socket.emit('webrtc', msg2);
                    // _myMediaStream.stop();
                    // _myMediaStream.getVideoTracks()[0].stop();
                    _myMediaStream.getVideoTracks().forEach(function (track) {
                        track.stop();
                        track.enabled = false;
                    });
                    _myMediaStream.getAudioTracks().forEach(function (track) {
                        track.stop();
                        track.enabled = false;
                    });
                    _myMediaStream = null;
                    _myConnection.close();
                    _myConnection=null;
                    var videos = document.getElementsByTagName("video");
                    for (var i = 0; i < videos.length; i++) {
                        videos[i].pause();
                        videos[i].style.display = "none";
                    }
                    document.getElementById('chat-main-panel').style.height = "410px";
                    document.getElementById('videoSpan').className = "glyphicon glyphicon-facetime-video";
                    document.getElementById('videoBtn').blur();
                    
                    //_myConnection.close();
                }
                else if (msg.type == "request") {
                    BootstrapDialog.show({
                        title: 'Video Request',
                        message: msg.name + 'is asking for video chat with you.',
                        buttons: [{
                            label: 'Accept',
                            action: function (dialog) {
                                getUserMedia(
                                    // Media constraints
                                    {
                                        video: true,
                                        audio: true
                                    },
                                    // Success callback
                                    function (stream) {


                                        _myMediaStream = stream;

                                        // var videoElement = document.querySelector('#media');
                                        // attachMediaStream(videoElement, _myMediaStream);
                                        _myConnection = _myConnection || _createConnection(null);

                                        // Add our stream to the peer connection
                                        _myConnection.addStream(_myMediaStream);
                                        msg2 = {
                                            type: 'accept',
                                            targetId: $rootScope.user.targetId
                                        }
                                        $rootScope.socket.emit('webrtc', msg2);

                                        sendOffer();
                                    },
                                    // Error callback
                                    function (error) {
                                        // Super nifty error handling
                                        alert(JSON.stringify(error));
                                    });
                                dialog.close();
                            }
                        }, {
                                label: 'Cancel',
                                action: function (dialog) {
                                    dialog.close();
                                }
                            }]
                    });


                    console.log("send accept");
                } else if (msg.type == "accept") {
                    console.log("receive accept");
                    document.getElementById('videoBtn').blur();
                    getUserMedia(
                        // Media constraints
                        {
                            video: true,
                            audio: true
                        },
                        // Success callback
                        function (stream) {


                            // Store off our stream so we can access it later if needed
                            _myMediaStream = stream;
                            _myConnection = _myConnection || _createConnection(null);
                            _myConnection.addStream(_myMediaStream);

                            sendOffer();
                        },
                        // Error callback
                        function (error) {
                            // Super nifty error handling
                            alert(JSON.stringify(error));
                        });

                } else if (msg.type == "close") {
                    // _myMediaStream.stop();
                    // _myMediaStream.getVideoTracks()[0].stop();
                    _myMediaStream.getVideoTracks().forEach(function (track) {
                        track.stop();
                        track.enabled = false;
                    });
                    _myMediaStream.getAudioTracks().forEach(function (track) {
                        track.stop();
                        track.enabled = false;
                    });
                    _myMediaStream = null;
                    _myConnection.close();
                    _myConnection=null;

                    var videos = document.getElementsByTagName("video");
                    for (var i = 0; i < videos.length; i++) {
                        videos[i].pause();
                        videos[i].style.display = "none";
                    }
                    document.getElementById('chat-main-panel').style.height = "410px";
                    document.getElementById('videoSpan').className = "glyphicon glyphicon-facetime-video";
                    document.getElementById('videoBtn').blur();
                    //_myConnection.close();
                } else if (msg.type == "webrtc") {
                    var message = JSON.parse(msg.content),
                        connection = _myConnection || _createConnection(null);

                    // An SDP message contains connection and media information, and is either an 'offer' or an 'answer'
                    if (message.sdp) {
                        connection.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
                            if (connection.remoteDescription.type == 'offer') {
                                console.log('received offer, sending answer...');

                                // Add our stream to the connection to be shared
                                //connection.addStream(_myMediaStream);

                                // Create an SDP response
                                connection.createAnswer(function (desc) {
                                    // Which becomes our local session description
                                    connection.setLocalDescription(desc, function () {
                                        // And send it to the originator, where it will become their RemoteDescription
                                        //hub.server.webRtcSignal(JSON.stringify({ 'sdp': connection.localDescription }), GroupId);
                                        msg2 = {
                                            type: 'webrtc',
                                            content: JSON.stringify({ 'sdp': connection.localDescription }),
                                            targetId: $rootScope.user.targetId
                                        }
                                        $rootScope.socket.emit('webrtc', msg2);
                                    });
                                }, function (error) { console.log('Error creating session description: ' + error); });
                            } else if (connection.remoteDescription.type == 'answer') {
                                //gotAnswer = true;
                                console.log('got an answer');
                            }
                        });
                    } else if (message.candidate) {
                        // if (!isCaller && !gotOffer) {
                        //     console.log("receive candidates before offer, ask for another offer");
                        //     hub.server.webRtcSignal(JSON.stringify({ 'no_offer': "send another offer" }), GroupId);

                        // } else {
                        console.log('adding ice candidate...');
                        connection.addIceCandidate(new RTCIceCandidate(message.candidate));
                        //}
                        // } else if (message.no_offer) {
                        //     sendOffer();
                        //     console.log("sending another offer");
                        // }

                        _myConnection = connection;
                    }
                }

            }

            model.videoClick = function () {
                if (_myMediaStream == null || _myMediaStream.active == false) {
                    model.connect("request");
                    BootstrapDialog.alert('Video chat request sent.');
                } else {
                    model.connect("close");
                }
            };

            model.exit = function () {
                if (_myMediaStream != null) {
                    model.connect("close");
                }
                // $rootScope.socket.emit('forceDisconnect');
                $('#exitClassroom').hide();
                $rootScope.inClassroom = false;
                if($rootScope.isGuest)$rootScope.user=null;
                // $location.path('/lobby');
                window.location.replace("/");
            };

            
            model.chatConnect = function (connId) {
                // var connId = $(this).attr('value');
                var msg2 = {
                    type: 'request',
                    targetId: connId,
                    sourceUser: $rootScope.user
                }
                $rootScope.socket.emit('user', msg2)
                BootstrapDialog.alert('Connection request sent.');
            };

            $('#toolMenu li > a').click(function (e) {
                model.tool = new tools[this.name]();
                if (this.name == 'pencil') {
                    $('#toolBtn').html("<span class='glyphicon glyphicon-pencil' aria-hidden='true'> <span class='caret'></span></span>");

                } else if (this.name == 'rect') {
                    $('#toolBtn').html("<span class='glyphicon glyphicon-unchecked' aria-hidden='true'> <span class='caret'></span></span>");

                } else if (this.name == 'line') {
                    $('#toolBtn').html("<span class='glyphicon glyphicon-minus' aria-hidden='true'> <span class='caret'></span></span>");

                } else if (this.name == 'eraser') {
                    $('#toolBtn').html("<span class='glyphicon glyphicon-erase' aria-hidden='true'> <span class='caret'></span></span>");

                }
            });

            $('#colorMenu li > a').click(function (e) {
                model.color = this.name;
                document.getElementById('colorSpan').style.background = this.name;
            });

            $("#btn-input").keyup(function (event) {
                if (event.keyCode == 13) {
                    $("#btn-chat").click();
                }
            });



            _myConnection = _myConnection || _createConnection(null);
        });
    }
})();