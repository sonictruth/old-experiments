(function() {


    var width = window.innerWidth,
    height = window.innerHeight;
    var cameraAngle = 45,
    aspectRatio = width / height,
    near = 0.1,
    far = 10000; 
    var minicooper, video, videoTexture;

    var requestAnim = Modernizr.prefixed('requestAnimationFrame', window);


    /* scene & camera */
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(cameraAngle, aspectRatio, near, far);
    var renderer = new THREE.WebGLRenderer({
        //alpha: true,
        antialiasing: true
    });
    renderer.setSize(width, height);
    //renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('id', 'scene');


    /* Lights */
    pointLight = new THREE.PointLight(0xFFFFFF);
    ambientLight = new THREE.AmbientLight(0x55);
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    scene.add(pointLight);
  //  scene.add(ambientLight);
    camera.position.z = 240;
    document.body.appendChild(renderer.domElement);


    function createVideoDome(src) {
        /* Create HTML5 video element */
        video = document.createElement('video');
        video.src = src;
        video.load();
        videoTexture = new THREE.Texture(video); 
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoMaterial = new THREE.MeshPhongMaterial({
            specular: 0xff9900, shininess: 10,
            map: videoTexture,
            side: THREE.BackSide
        });
  
        var wf = new THREE.MeshBasicMaterial({ // wireframe test
            color: 0xff0000,
            wireframe: true
        });

        var videoDome = new THREE.Mesh(new THREE.SphereGeometry(300, 100, 30),videoMaterial); //wf
        scene.add(videoDome);
        videoDome.position.z = -60;
        //videoDome.position.x = -100;
        loadModel();
        window.vd = videoDome; //for debug 
    }




    var render = function() {
        videoTexture.needsUpdate = true;
        minicooper.rotation.z += 0.001;
        renderer.render(scene, camera);
        requestAnim(render);
        minicooper.visible = false;
        mirrorCubeCamera.updateCubeMap(renderer, scene);
        minicooper.visible = true;
    };


    function loadModel() {
        /* Load our model and start rendering */
        var loader = new THREE.JSONLoader();
        loader.load('minicooper.js', function(geometry, materials) {

            mirrorCubeCamera = new THREE.CubeCamera(0.1, 100000, 128);
            scene.add(mirrorCubeCamera);

            var chromeMaterial = new THREE.MeshPhongMaterial({
               // color: 0xFFFF00,
                specular: 0x009900, shininess: 30,
                ambient: 0xffffff,
                envMap: mirrorCubeCamera.renderTarget
            });

            var object = new THREE.Mesh(geometry, chromeMaterial); // new THREE.MeshFaceMaterial(materials)
            object.scale.set(3, 3, 3);

            minicooper = new THREE.Object3D();
            minicooper.add(object);
            scene.add(minicooper);

            document.getElementById('scene').style.display = 'block';
            document.getElementById('loader').style.display = 'none';
            minicooper.rotation.z = 300;
            minicooper.rotation.x = 300;
            minicooper.position.y -= 100;
            minicooper.position.z -= 200;
            //minicooper.position.x -= 100;   
            video.play();
            render();
        });
}

$("#intro").fadeIn();
$("#start").click(function() {

    $("#intro").hide();
    $("#loader").show();

    if (!Modernizr.video || !Modernizr.webgl) {
        $("#intro").html('Sorry ! No HTML5 video or WebGl detected. Try latest version of chrome :( ');
            return;
        }

        if(!confirm('Press OK to use webcam or Cancel to load the SpongeBob video')){
            createVideoDome('spong.mp4'); 
            return;
        }

        var getWebcam = Modernizr.prefixed('getUserMedia', navigator);

        if(!getWebcam){
            createVideoDome('spong.mp4');  
            return;
        }

        getWebcam({
            video: true,
            audio: false
        }, function(localMediaStream) {
          
            createVideoDome(window.URL.createObjectURL(localMediaStream));            

        }, function(error) {
            
            createVideoDome('spong.mp4');            

        });




    });

})();