//scene creation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor(0xb7c3f3, 1);
//light
const light = new THREE.AmbientLight( 0xffffff ); 
scene.add( light );

//global variables
const start_pos = 3;
const end_pos = -start_pos;
const text = document.querySelector(".text");
const time_limit = 10;
let game_stat = "loading"
let isLookingBackward = true


//cube creation
function createCube(size, positionX, rotY = 0, color = 0xfbc851){
    const geometry = new THREE.BoxGeometry(size.w,size.h,size.d);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = positionX;
    cube.rotation.y = rotY;
    scene.add( cube );
    return cube;

}

camera.position.z = 5;

const loader = new THREE.GLTFLoader()

function Delay(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

//squid game doll class
class Doll {
    constructor(){
        loader.load("A://Downloads/squid game-20220318T222202Z-001/squid game/models/scene.gltf", (gltf)=>{
            scene.add(gltf.scene);
            gltf.scene.scale.set(0.4,0.4,0.4);
            gltf.scene.position.set(0,-1,0);
            this.doll = gltf.scene;
          });
    }
    
    // lookbackward(){
    //     gsap.to(this.doll.rotation, {y: -3.15, duration: 0.45})
    //     setTimeout(()=>isLookingBackward = true,150)
    // }

    // lookforward(){
    //     gsap.to(this.doll.rotation, {y: 0, duration: 0.45})
    //     setTimeout(()=> isLookingBackward = false,450)
    // }

    async start(){
        // this.lookbackward();
        await Delay((Math.random*1000) + 1000);
        // this.lookforward();
        await Delay((Math.random*750) + 750);
        this.start();
    }
}

function GameTrack(){
    createCube({w: 0.2,h: 1.5 ,d: 1}, start_pos, -0.35);
    createCube({w: 0.2,h: 1.5 ,d: 1}, end_pos, 0.35);
    createCube({w: start_pos * 2 + 0.15,h: 1.5 ,d: 1}, 0,0, 0xe5a716).position.z=-1;
}

GameTrack();

//creating player class 

class Player{
    constructor(){
        const geometry = new THREE.SphereGeometry( 0.35, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = 1;
        sphere.position.x = start_pos;
        scene.add( sphere );
        this.player = sphere;
        this.playerinfo = {
            positionX: start_pos,
            velocity: 0
        }
    }

    run(){
        this.playerinfo.velocity = 0.03;
    }


    check(){
        if (this.playerinfo.velocity>0 && !isLookingBackward){
            text.innerText = "You Lose!"
            game_stat="over"
        }
        if (this.playerinfo.positionX < end_pos + 0.4){
            text.innerText = "You Win!"
            game_stat="over"
        }
    }


    update(){
        this.check();
        this.playerinfo.positionX -= this.playerinfo.velocity;
        this.player.positionX += this.playerinfo.positionX;
    }

    stop(){
        gsap.to(this.playerinfo, {velocity: 0,duration: 0.1})
    }

}

const player = new Player();

let doll = new Doll();



// initiating the game
async function init(){
    await Delay(500);
    text.innerText = "Starting in 3"
    await Delay(100);
    text.innerText = "Starting in 2"
    await Delay(1000);
    text.innerText = "Starting in 1"
    await Delay(1000);
    text.innerText = "Go!"
    startGame();
}

function startGame(){
    game_stat="starting"
    let progressbar = createCube({w: 5, h: 0.1, d: 1},0)
    progressbar.position.y = 3.3;
    gsap.to(progressbar.scale,{x: 0,duration: time_limit});

    setTimeout(()=>{
        if (game_stat != "over"){
            text.innerText = "You ran out of time"
            game_stat = "over"
        }

    },time_limit * 1000)

    doll.start();
}


setTimeout(()=>{
    doll.start();
},1000);

function animate(){
    if (game_stat=="over") return
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
    player.update();
}

animate();

window.addEventListener( 'resize' ,onWindowResize, false);

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight ;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth , window.innerHeight);

}

window.addEventListener( 'keydown' ,(e)=>{
    if(game_stat!= "started") return
    if (e.key == "ArrowUp"){
        player.run();
    }
})

window.addEventListener( 'keyup' ,(e)=>{
    if (e.key == "ArrowUp"){
        player.stop();
    }
})