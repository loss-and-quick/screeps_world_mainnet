const harvesters =require("role.harvester") 
const upgraders=require("role.upgrader")
const builders=require("role.builder")
const max_harvests=4
const max_upgraders=2
const max_builders=3
module.exports.loop = function () {
 for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
 for (var room_name in Game.rooms){
    
    var room=Game.rooms[room_name];
    //let local_creeps=[]
    var local_creeps={
        'harvesters':_.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'),
        'upgraders':_.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'),
        'builders':_.filter(Game.creeps, (creep) => creep.memory.role == 'builder'),
        'defenders':[]
    }
   
    for (const creep_name in Game.creeps){
        if (Game.creeps[creep_name].room==room){
            if (Game.creeps[creep_name].memory.role=='harvester'){
                local_creeps['harvesters'].push(Game.creeps[creep_name])
            }
            
        }
    }
    
    
    
    var targets = room.find(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN );
                        }
                });
    
    for (var spawner of targets){
        if (spawner){
            if (local_creeps['harvesters'].length<max_harvests){
                    var body=[WORK,CARRY,MOVE]
                    var name='harvest_';
                    var id=0;
                    var resp=spawner.createCreep(body,name+id,{role: 'harvester'});
                    
                    while (resp==ERR_NAME_EXISTS){
                        id=id+1;
                        var resp=spawner.createCreep(body,name+id,{role: 'harvester'});
                    }
            }
            if (local_creeps['upgraders'].length<max_upgraders){
                var body=[WORK,CARRY,CARRY,MOVE]
                var name='upgrader_';
                var id=0;
                var resp=spawner.createCreep(body,name+id,{role: 'upgrader'});
                while (resp==ERR_NAME_EXISTS){
                        id=id+1;
                        var resp=spawner.createCreep(body,name+id,{role: 'upgrader',upgrading:false});
                    }
            }
            if (local_creeps['builders'].length<max_builders){
                var body=[WORK,CARRY,CARRY,MOVE]
                var name='builder_';
                var id=0;
                var resp=spawner.createCreep(body,name+id,{role: 'builder'});
                while (resp==ERR_NAME_EXISTS){
                        id=id+1;
                        var resp=spawner.createCreep(body,name+id,{role: 'builder',building:false});
                    }
                
            }
                    
        }
    }
    for (var creep of local_creeps['harvesters']){

        harvesters.farm(creep)
        
        
    }
    for (var creep of local_creeps['builders']){
            builders.build(creep)
    }
    
    for (var creep of local_creeps['upgraders']){
            upgraders.upgrade(creep)
    }
     
 
 }
 
 
 

    
}