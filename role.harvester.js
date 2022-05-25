/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
const upgraders=require("role.upgrader")
var roleHarvester = {
 
   farm: function(creep){
    const target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if(target) {
        if(creep.harvest(target) == ERR_NOT_IN_RANGE && creep.store.getFreeCapacity() > 0) {
            creep.say('🔄harvest')
            creep.moveTo(target);
        } else{
            if (creep.store.getFreeCapacity() == 0){
                
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                if(targets.length > 0) {
                    creep.say("Im full");
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    
                }else{
                    creep.memory.upgrading=false
                    upgraders.upgrade(creep)
                }
            }
        }
    }
    
       
  }
}


module.exports = roleHarvester