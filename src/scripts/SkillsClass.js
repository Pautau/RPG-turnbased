function randomizeMinMax(min, max) {
    return Math.floor(Math.random() * (max- min + 1) + min);
}

function criticalHitDice(critChance){
    let dice = Math.floor(Math.random() * (100 + 1));
    return dice < critChance;
}

useSkill = {
    basicSlash: function (type, name, stats, maxVitals, currentVitals, percentageVitals, critMultiplier = 1.25) {
        let minDamage = 5 * (stats[0] / 2);
        let maxDamage = 10 * (stats[0] / 1.8);

        // Take a random number between minDamage and maxDamage
        let damage = Math.round(randomizeMinMax(minDamage, maxDamage));

        // roll the dice, if it's critical deal (damage * critMultiplier)
        let critical = criticalHitDice(stats[3]);

        if (critical){
            damage = Math.round(damage *critMultiplier);
            let battleText = name + ' jumps before slashing his target right on the head dealing ' + damage + ' damage';
            // Add the log
            addLog(type, name, infoSkill.basicSlash['skillType'], battleText, critical);
        } else {
            let battleText = name + ' slashes his enemy for ' + damage + ' damage';
            // Add the log
            addLog(type, name, infoSkill.basicSlash['skillType'], battleText, critical);
        }

        // determine who is the target and who is the caster
        if (type === 'player') {
            player.alterVital(-infoSkill.basicSlash.staminaCost, 1);
            enemy.alterVital(-damage, 0);
        } else {
            enemy.alterVital(-infoSkill.basicSlash.staminaCost, 1);
            player.alterVital(-damage, 0);
        }
    },
    skip: function (type, name, stats, maxVitals, currentVitals, percentageVitals, critMultiplier = 1.25) {
        let recover = Math.round(20 + (maxVitals[1]*0.05));
        // Adding the log
        let battleText = name + ' takes a deep breath and recover ' + recover + ' of his stamina.';
        addLog(type, name, infoSkill.skip['skillType'], battleText);

        if (type === 'player') {
            player.alterVital(recover, 1);
        } else {
            enemy.alterVital(recover, 1);
        }
    },
    powerSlash: function (type, name, stats, maxVitals, currentVitals, percentageVitals, critMultiplier = 1.25) {
        let minDamage = 10 * (stats[0] / 1.8);
        let maxDamage = 20 * (stats[0] / 1.6);

        // Take a random number between minDamage and maxDamage
        let damage = Math.round(randomizeMinMax(minDamage, maxDamage));

        // roll the dice, if it's critical deal (damage * critMultiplier)
        let critical = criticalHitDice(stats[3]);

        if (critical){
            damage = Math.round(damage *critMultiplier);
            let battleText = name + ' shatters fiercely his opponent head, dealing massive ' + damage + ' damage.';
            // Add the log
            addLog(type, name, infoSkill.powerSlash['skillType'], battleText, critical);
        } else {
            let battleText = name + ' smashes his opponent head with all his strength, dealing ' + damage + ' damage.';
            // Add the log
            addLog(type, name, infoSkill.powerSlash['skillType'], battleText, critical);
        }

        // determine who is the target and who is the caster
        if (type === 'player') {
            player.alterVital(-infoSkill.powerSlash.staminaCost, 1);
            enemy.alterVital(-damage, 0);
        } else {
            enemy.alterVital(-infoSkill.powerSlash.staminaCost, 1);
            player.alterVital(-damage, 0);
        }
    },
    finalBlow: function (type, name, stats, maxVitals, currentVitals, percentageVitals, critMultiplier = 2) {
        let minDamage = 0
        let maxDamage = 0
        if (type === 'player') {
            let hpPercent = enemy.getPercentageVitals(0)
            minDamage = 5+(100 - hpPercent[0]) * (stats[0] / 8);
            maxDamage = 5+(100 - hpPercent[0]) * (stats[0] / 5);
        } else {
            let hpPercent = player.getPercentageVitals(0)
            minDamage = 5+(100 - hpPercent[0]) * (stats[0] / 8);
            maxDamage = 5+(100 - hpPercent[0]) * (stats[0] / 5);
        }

        // Take a random number between minDamage and maxDamage

        let damage = Math.round(randomizeMinMax(minDamage, maxDamage));

        // roll the dice, if it's critical deal (damage * critMultiplier)
        let critical = criticalHitDice(stats[3]);

        if (critical){
            damage = Math.round(damage *critMultiplier);
            let battleText = name + ' explodes his opponent skull dealing ' + damage + ' damage.';
            // Add the log
            addLog(type, name, infoSkill.finalBlow['skillType'], battleText, critical);
        } else {
            let battleText = name + ' crashes his opponent skull dealing ' + damage + ' damage.';
            // Add the log
            addLog(type, name, infoSkill.finalBlow['skillType'], battleText, critical);
        }

        // determine who is the target and who is the caster
        if (type === 'player') {
            player.alterVital(-infoSkill.finalBlow.staminaCost, 1);
            enemy.alterVital(-damage, 0);
        } else {
            enemy.alterVital(-infoSkill.finalBlow.staminaCost, 1);
            player.alterVital(-damage, 0);
        }
    },
    recover: function (type, name, stats, maxVitals, currentVitals, percentageVitals, critMultiplier = 1.25) {
        let recover = Math.round(maxVitals[0]*0.15),
        // Adding the log
        battleText = name + ' bandages his wounds and recover ' + recover + '  health and stamina..';
        addLog(type, name, infoSkill.skip['skillType'], battleText);

        if (type === 'player') {
            player.alterVital(recover, 0);
            player.alterVital(recover, 1);
        } else {
            enemy.alterVital(recover, 0);
            enemy.alterVital(recover, 1);
        }
    },
    allForOne: function (type, name, stats, maxVitals, currentVitals, percentageVitals, critMultiplier = 1.25) {
        let minDamage = 5+(100 - percentageVitals[0]) * (stats[0] / 10);
        let maxDamage = 5+(100 - percentageVitals[0]) * (stats[0] / 7);

        // Take a random number between minDamage and maxDamage
        let damage = Math.round(randomizeMinMax(minDamage, maxDamage));

        // roll the dice, return true if critical, false if not
        let critical = criticalHitDice(stats[3]);

        if (critical){
            damage = Math.round(damage *critMultiplier);
            let battleText = "For each blood " + name + " lost, his sword strikes harder ravaging his opponent health for " + damage + " damage.";
            // Add the log
            addLog(type, name, infoSkill.allForOne['skillType'], battleText, critical);
        } else {
            let battleText = name + ' attempts to give back everything he endured in this battle, dealing ' + damage + ' damage';
            // Add the log
            addLog(type, name, infoSkill.allForOne['skillType'], battleText, critical);
        }

        // determine who is the target and who is the caster
        if (type === 'player') {
            player.alterVital(-infoSkill.allForOne.staminaCost, 1);
            enemy.alterVital(-damage, 0);
        } else {
            enemy.alterVital(-infoSkill.allForOne.staminaCost, 1);
            player.alterVital(-damage, 0);
        }
    },
};

infoSkill = {
    skip: {
        name: 'skip',
        dataName: 'Skip',
        skillType: 'Support',
        info: 'Skip your turn, recovering 20 + 5% of your max stamina.',
        img: '../img/icons/skills/skip.png',
        healthCost: 0,
        staminaCost: 0,
        manaCost : 0,
        cooldown: 0,
    },

    inspect: {
        name: 'inspect',
        dataName: 'Inspect',
        skillType: 'Support',
        info: "Inspect your enemy's flaws. [not implemented yet]",
        img: '../img/icons/skills/inspect.png',
        healthCost: 0,
        staminaCost: 0,
        manaCost : 0,
        cooldown: 0,
    },

    flee: {
        name: 'flee',
        dataName: 'Flee',
        skillType: 'Defensive',
        info: "Sometimes fleeing is a better idea than being turned into a corpse. [not implemented yet]",
        img: '../img/icons/skills/flee.png',
        healthCost: 0,
        staminaCost: 10,
        manaCost : 0,
        cooldown: 0,
    },

    basicSlash: {
        name: 'basicSlash',
        dataName: 'Basic Slash',
        skillType: 'Offensive',
        info: 'A basic slash that deal regular damage',
        img: '../img/icons/skills/basic_slash.png',
        healthCost: 0,
        staminaCost: 20,
        manaCost : 0,
        cooldown: 0,
    },

    powerSlash: {
        name: 'powerSlash',
        dataName: 'Power Slash',
        skillType: 'Offensive',
        info: '<p>[CD: 2 turns]</p> A powerful blow that deals huge damage to its target.',
        img: '../img/icons/skills/power_slash.png',
        healthCost: 0,
        staminaCost: 35,
        manaCost : 0,
        cooldown: 2,
    },

    recover: {
        name: 'recover',
        dataName: 'Recover',
        skillType: 'Support',
        info: '<p>[CD: 3 turns]</p> Heal yourself up to 15% of your max health and the same amount for your stamina.',
        img: '../img/icons/skills/recover.png',
        healthCost: 0,
        staminaCost: 0,
        manaCost : 0,
        cooldown: 3,
    },

    allForOne: {
        name: 'allForOne',
        dataName: 'All For One',
        skillType: 'Offensive',
        info: '<p>[CD: 2 turns]</p> The lower your health the greater the damage',
        img: '../img/icons/skills/all_for_one.png',
        healthCost: 0,
        staminaCost: 40,
        manaCost : 0,
        cooldown: 2,
    },
    finalBlow: {
        name: 'finalBlow',
        dataName: 'Final Blow',
        skillType: 'Offensive',
        info: '<p>[CD: 3 turns]</p> The lower your opponent\'s health the greater the damage',
        img: '../img/icons/skills/final_blow.png',
        healthCost: 0,
        staminaCost: 40,
        manaCost : 0,
        cooldown: 2,
    },
};

