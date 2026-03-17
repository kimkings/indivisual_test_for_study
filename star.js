Game.interstellar.stars = (function(){

    var instance = {};

    instance.dataVersion = 1;
    instance.entries = {};
    instance.starCount = 0;

    instance.systemsConquered = 0;
    instance.eventTable = {
        carnelian: {
            title: "Recovered War Cache",
            desc: "A Carnelian cell abandons a hidden weapons cache rather than let it fall into enemy hands. Your crews salvage the stockpile.",
            rewards: {resources: {uranium: 2500, titanium: 85000}, opinion: 3}
        },
        prasnian: {
            title: "Imperial Archive Leak",
            desc: "A nervous Prasnian administrator trades sealed treasury records for safe passage, revealing stores of prestige metals.",
            rewards: {resources: {gold: 90000, silver: 140000}, opinion: 2}
        },
        hyacinite: {
            title: "Observatory Breakthrough",
            desc: "Hyacinite researchers invite your scientists into a field observatory and hand over a rare packet of post-human theory.",
            rewards: {resources: {science: 180000}, voidCore: 2, opinion: 2}
        },
        kitrinos: {
            title: "Trade Route Arbitrage",
            desc: "Kitrinos brokers fold your scouts into a private convoy and pay out in raw fuel, gems, and market access.",
            rewards: {resources: {gem: 150000, oil: 120000}, antimatter: 20000, opinion: 2}
        },
        moviton: {
            title: "Smuggler Relay",
            desc: "Moviton captains open a hidden relay lane and rush high-grade fuel through your new corridor.",
            rewards: {resources: {rocketFuel: 16000, hydrogen: 100000}, antimatter: 30000, opinion: 2}
        },
        overlord: {
            title: "Shrine of Collapse",
            desc: "Buried beneath the system is a Cult shrine tuned to the same resonance as your Singularity Reactors.",
            rewards: {voidCore: 4, resources: {plasma: 6000, helium: 70000}, opinion: 3}
        }
    };
    
    instance.initialise = function() {
        for (var id in Game.starData) {
            var data = Game.starData[id];
            
            this.starCount++;
            this.entries[id] = $.extend({}, data, {
                id: id,
                htmlId: 'star_' + id,
                current: 0,
                spy: 0,
                explored: false,
                owned: false,
                eventResolved: false,
                eventTitle: '',
                eventDesc: '',
                eventReward: '',
                displayNeedsUpdate: false,
            });
            
        }

        console.debug("Loaded " + this.starCount + " Stars");

    };

    instance.save = function(data) {
        data.stars = { v: this.dataVersion, i: {}};
        for(var key in this.entries) {
            data.stars.i[key] = this.entries[key].current;
        }
    };

    instance.exploreSystem = function(id){
        if(Game.interstellar.rocket.entries.tier1Rocket.built == true){
            var data = this.entries[id];
            var exploreCost = Math.floor(data.distance * 10000 * Game.stargaze.getTravelCostMultiplier());
            if(antimatter >= exploreCost){
                antimatter -= exploreCost;
                data.explored = true;
                document.getElementById('star_' + id).className = "hidden";
                document.getElementById('star_' + id + '_conquer').className = "";
                newNavUnlock('intnav_' + data.factionId);
                this.resolveExplorationEvent(data);
                data.displayNeedsUpdate = true;
            }
        }
    };

    instance.resolveExplorationEvent = function(star){
        if(star.eventResolved === true){
            return;
        }
        var eventData = this.eventTable[star.factionId];
        if(!eventData){
            return;
        }
        var faction = Game.stargaze.getStargazeData(star.factionId);
        var rewardMultiplier = Game.stargaze.getExpeditionRewardMultiplier();
        var rewardText = [];
        if(eventData.rewards.resources){
            for(var resource in eventData.rewards.resources){
                var amount = Math.floor(eventData.rewards.resources[resource] * rewardMultiplier);
                Game.resources.addResource(resource, amount);
                var resourceData = Game.resources.getResourceData(resource);
                rewardText.push(Game.settings.format(amount) + ' ' + (resourceData ? resourceData.name : Game.utils.capitaliseFirst(resource)));
            }
        }
        if(eventData.rewards.antimatter){
            var antimatterReward = Math.floor(eventData.rewards.antimatter * rewardMultiplier);
            antimatter = Math.min(antimatterStorage, antimatter + antimatterReward);
            rewardText.push(Game.settings.format(antimatterReward) + ' Antimatter');
        }
        if(eventData.rewards.voidCore){
            var voidCoreReward = Math.floor(eventData.rewards.voidCore * rewardMultiplier);
            voidCore += voidCoreReward;
            rewardText.push(Game.settings.format(voidCoreReward) + ' Void Cores');
        }
        if(eventData.rewards.opinion){
            faction.opinion += eventData.rewards.opinion;
            faction.displayNeedsUpdate = true;
            rewardText.push('+' + eventData.rewards.opinion + ' Relationship');
        }
        star.eventTitle = eventData.title;
        star.eventDesc = eventData.desc;
        star.eventReward = rewardText.join(', ');
        star.eventResolved = true;
        star.displayNeedsUpdate = true;
        Game.notifyInfo("Expedition Event", star.name + ": " + eventData.title + ". " + star.eventReward);
    };

    instance.getStarData = function(id) {
        return this.entries[id];
    };
    

    return instance;
}());
