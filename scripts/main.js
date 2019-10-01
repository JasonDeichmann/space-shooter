//Canvas values
let canvas = document.getElementById('canvas');
let canvas_w = canvas.width;
let canvas_h = canvas.height;

//Initial values
let ship = {
    width: 20,
    height: 20,
    x: 0,
    y: 0,
    m_left: false,
    m_up: false,
    m_right: false,
    m_down: false,
    is_shooting: false,
    can_shoot: true,
    fire_rate: 500,
    lasers: [],
};
ship.y = canvas_h - ship.height;

let enemies = [];
let enemy_spawn_rate = 750;

$(document).ready(function() {

    //Bind key events
    $(document).keydown(function(e) {
        switch(e.which){
            case 65: //left
                ship.m_left = true;
                break;
            case 87: //up
                ship.m_up = true;
                break;
            case 68: //right
                ship.m_right = true;
                break;
            case 83: //down
                ship.m_down = true;
                break;
            case 32: //shoot
                ship.is_shooting = true;
                break;
        }
    });

    $(document).keyup(function(e) {
        switch(e.which){
            case 65: //left
                ship.m_left = false;
                break;
            case 87: //up
                ship.m_up = false;
                break;
            case 68: //right
                ship.m_right = false;
                break;
            case 83: //down
                ship.m_down = false;
                break;
            case 32: //shoot
                ship.is_shooting = false;
                break;
        }
    });

    //Fire rate cooldown of the ship
    function fire_rate_cooldown(){
        ship.can_shoot = true;
        setTimeout(fire_rate_cooldown, ship.fire_rate);
    }
    setTimeout(fire_rate_cooldown, ship.fire_rate);

    //Spawn enemies
    function spawn_enemy(){
        let enemy = {
            width: 20,
            height: 20,
            x: 0,
            y: 0,
        };
        enemy.x = Math.floor(Math.random() * (canvas_w - enemy.width));
        enemy.y-=enemy.height;
        enemies.push(enemy);
        setTimeout(spawn_enemy, enemy_spawn_rate);
    }
    setTimeout(spawn_enemy, enemy_spawn_rate);

    //Start animation
    window.requestAnimationFrame(draw);
});

function ship_within_border(c_w, c_h){
    //Left
    if(ship.x < 0){
        ship.x = 0;
    }
    //Up
    if(ship.y < 0){
        ship.y = 0;
    }
    //Right
    if(ship.x + ship.width > c_w){
        ship.x = c_w - ship.width;
    }
    //Bottom
    if(ship.y + ship.height > c_h){
        ship.y = c_h - ship.height;
    }
}

function  check_laser_hit() {
    let hits = [];
    for (let i = 0; i < enemies.length; i++){
        for(let j = 0; j < ship.lasers.length; j++){
            //Check if enemy and laser collided
            if(((ship.lasers[j].x > enemies[i].x && ship.lasers[j].x < enemies[i].x + enemies[i].width) || (ship.lasers[j].x + ship.lasers[j].width > enemies[i].x && ship.lasers[j].x + ship.lasers[j].width < enemies[i].x + enemies[i].width)) && (ship.lasers[j].y > enemies[i].y && ship.lasers[j].y < enemies[i].y + enemies[i].height)){
                let hit = {
                    laser_index: j,
                    enemy_index: i,
                };
                hits.push(hit);
            }
        }
    }

    for (let i = 0; i < hits.length; i++){
        ship.lasers.splice(hits[i].laser_index, 1);
        enemies.splice(hits[i].enemy_index, 1);
    }
}

//Animation
function draw(){

    //SHIP MOVEMENT
    if(ship.m_left){
        ship.x-=5;
    }
    if(ship.m_up){
        ship.y-=5;
    }
    if(ship.m_right){
        ship.x+=5
    }
    if(ship.m_down){
        ship.y+=5;
    }

    ship_within_border(canvas_w, canvas_h);

    //UPDATE ENEMIES
    for(let i = 0; i < enemies.length; i++){
        //Move the laser up
        enemies[i].y+=3;

        //If no longer in bounds, remove it
        if(enemies[i].y > canvas_h){
            enemies.splice(i, 1);
        }
    }

    //UPDATE LASERS
    for(let i = 0; i < ship.lasers.length; i++){
        //Move the laser up
        ship.lasers[i].y-=7;

        //If no longer in bounds, remove it
        if(ship.lasers[i].y + ship.lasers[i].height < 0){
            ship.lasers.splice(i, 1);
        }
    }

    //CHECK SHOT COLLISION WITH ENEMY
    check_laser_hit();

    //SHIP SHOOTING
    if(ship.is_shooting){
        if(ship.can_shoot){
            ship.can_shoot = false;
            let laser = {
                width: 5,
                height: 15,
                x: 0,
                y: 0,
            };
            laser.x = ship.x + ship.width/2 - laser.width/2;
            laser.y = ship.y -laser.height;
            ship.lasers.push(laser);
        }
    }

    //DRAWING
    //Get the canvas context
    let canvas = document.getElementById('canvas').getContext('2d');

    //Clear the canvas
    canvas.clearRect(0, 0, 300, 300);

    //Ship
    canvas.fillRect(ship.x, ship.y, ship.width, ship.height);

    //Lasers
    for (let i = 0; i < ship.lasers.length; i++){
        canvas.fillRect(ship.lasers[i].x, ship.lasers[i].y, ship.lasers[i].width, ship.lasers[i].height);
    }

    //Enemies
    //Lasers
    for (let i = 0; i < enemies.length; i++){
        canvas.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }

    window.requestAnimationFrame(draw);
}