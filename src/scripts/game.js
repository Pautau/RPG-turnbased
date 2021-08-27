function randomBackground() {
    let random = Math.round(Math.random() * (7 - 1) + 1);

    $('.bg_img, .logs_background').css('backgroundImage', "url('../img/bg/bg" + random +".jpg')");
    /*css('backgroundImage', "url('../../img/bg/bg" + random +".jpg')");*/
}

function randomPortrait() {
    let randomP = Math.round(Math.random() * (3 - 1) + 1);
    let randomE = Math.round(Math.random() * (3 - 1) + 1);

    $('.player_portrait').attr('src', "../img/portraits/portrait_male(" + randomP +").png");
    $('.enemy_portrait').attr('src', "../img/portraits/portrait_female(" + randomE +").png");
}


function generateInfos() {
    randomBackground();
    randomPortrait();
    player.displayAll();
    displaySkills();
    enemy.displayAll();
}

/* Display each skill the player has slotted
 * Player cannot slot more than 4 skills.
 */
function displaySkills() {
    for (let i = 1; i <= 5; i++) {
        // Verify if the player has a skill slotted in each slot
        if (typeof(player.getSkill(i)) == 'object'){
            let skillName = player.getSkill(i)['name'];
            let cooldown = player.getSkill(i).cooldown;
            let state = cooldown > 0 ? 'disabled="disabled"' : '';

            // Add each skills to the bar, display the cooldown if it's greater than 0
            $('.skills').append(
                "<img class='skill skill_" + infoSkill[skillName]['skillType'] + "' src='../img/ui/cd" + cooldown + ".png'" + state + " data-number='" + i + "'/>"
            );

            // Add the skill's icon as a background and as data-img
            let currentElement = '.skill:nth-child(' + (i+1) + ')';
            $(currentElement).attr('data-img', infoSkill[skillName]['img']);
            $(currentElement).css("backgroundImage", 'url(' + infoSkill[skillName]['img'] + ')')

            // Add the skill type as data-type, his name as data-name
            $(currentElement).attr('data-type', infoSkill[skillName]['skillType']);
            $(currentElement).attr('data-name', infoSkill[skillName]['dataName']);
        }
    }
}

function cooldownSkillsCheck() {
    for (let i = 1; i <= 5; i++) {
        let cooldown = player.getSkill(i).cooldown;
        let element = ".skill[data-number='"+ i +"']";

        // Verify if the player has a skill slotted in each slot
        if (typeof(player.getSkill(i)) == 'object' && cooldown > 0) {
            $(element).attr('disabled', true);
            $(element).attr('src', '../img/ui/cd' + cooldown + '.png');
        } else {
            $(element).attr('disabled', false);
            $(element).attr('src', '../img/ui/cd' + cooldown + '.png');
        }
    }
}

function reduceSkillsCooldown() {
    for (let i = 1; i <= 5; i++) {
        // Verify if the player has a skill slotted in each slot
        if (typeof(player.getSkill(i)) == 'object' && player.getSkill(i)['cooldown'] > 0){
            player.reduceSkillCooldown(i)
        }
        if  (typeof(enemy.getSkill(i)) == 'object' && enemy.getSkill(i)['cooldown'] > 0){
            enemy.reduceSkillCooldown(i)
        }
    }
}

/* Display an event in the logs
* TYPE must be either "player" or "enemy"
* ACTION must be either "Attack", "Miss", "Dodge" or "Critical" */
function addLog(type, name, action, text, critical) {
    let criticalClass = (critical) ? type + '_critical ' : '';
    let criticalMessage = (critical) ? '[CRITICAL] ' : '';
    $('.logs').prepend(
        "<p><span class='turn_details " + criticalClass + type + "_" + action + "'>[" + name + " - " + action + "]</span>" +
            "<span class='combat_desc'>" + criticalMessage + text  + "</span></p>");
}

/* Activate all the combat buttons
*  Also displays "Your turn" */
function activateElements(){
    $('.skill, .combat_button').attr('disabled', false);
    $('.turn_info').text("Your turn");
    cooldownSkillsCheck();
}

/* Deactivate all the combat buttons
*  Also display if the combat is won or lost
*  if none of the above is mentioned, displays "enemy's turn" */
function deactivateElements(turn = 'enemy'){
    cooldownSkillsCheck();
    $('.skill, .combat_button').attr('disabled', true);
    let element = $('.turn_info');
    switch (turn) {
        case "win": element.text("Victory!"); break;
        case "defeat": element.text("Defeat..."); break;
        default : element.text("Enemy's turn");
    }
}

function enemyAttack(skill) {
    useSkill[skill]('enemy', enemy.getName(), enemy.getStats(), enemy.getMaxVitals(), enemy.getCurrentVitals(), enemy.getPercentageVitals());
}

function randomizeMinMax(min, max) {
    return Math.floor(Math.random() * (max- min + 1) + min);
}

function enemyTurn() {
    if (enemy.getCurrentVitals()[0] > 0) {

    setTimeout(function() {
        let skillNumber = randomizeMinMax(1,2)
        let skillUsed = enemy.getSkill(skillNumber).name;
        if (enemy.getCurrentVitals()[1] >= infoSkill[skillUsed].staminaCost)  {
            enemyAttack(skillUsed);
        } else {
            useSkill['skip']('enemy', enemy.getName(), enemy.getStats(), enemy.getMaxVitals(), enemy.getCurrentVitals(), enemy.getPercentageVitals());
        }

        if (player.getCurrentVitals()[0] === 0) {
            deactivateElements('defeat')
        } else {
            activateElements();
        }
        }, 750);
    }
}

/* Control if the skill's cost is lower than player's current vital.
    if true, use the skill, otherwise miss. */
function costSkillControl(skillName){
    if ((infoSkill[skillName]['staminaCost'] <= player.getCurrentVitals()[1]) && (infoSkill[skillName]['manaCost'] <= player.getCurrentVitals()[2])) {
        useSkill[skillName]('player', player.getName(), player.getStats(), player.getMaxVitals(), player.getCurrentVitals(), player.getPercentageVitals());
    } else {
        if (infoSkill[skillName]['staminaCost'] > player.getCurrentVitals()[1]){
            addLog('player', player.getName(), 'Miss', (player.getName() + ' is so exhausted that he misses his target.'))
        } else {
            addLog('player', player.getName(), 'Miss', (player.getName() + " isn't focus enough to cast a spell."))
        }
    }
}

function setCooldownSkill(skillNumber, skillName, type){
    if (type === 'player') {
        player.getSkill(skillNumber)['cooldown'] = infoSkill[skillName]['cooldown'];
    } else {
        enemy.getSkill(skillNumber)['cooldown'] = infoSkill[skillName]['cooldown'];
    }
}


/* ------------- */
function generateBoard() {
    generateInfos();

    $('.skills img, .combat_button').hover(function showDetails (){

        let skillNumber = parseInt($(this).attr('data-number'));
        let skillName = player.getSkill(skillNumber).name;
        $('.details').css('opacity', 1);
        $('.details_icon').attr('src', $(this).attr('data-img')).attr('data-type', $(this).attr('data-type'));
        $('.details_name').html($(this).attr('data-name'));
        $('.details_info').html($(this).attr('data-type'));
        $('.details_detailed').html(
            '<p class="details_detailed_label"> Vitals costs: </p>' +
            '<div class="vitals_costs">' +
                '<div class="vital_cost "><img src="../img/icons/stats/health.png" class="vital_health" alt=""> <p class="health_cost"></p></div>'+
                '<div class="vital_cost "><img src="../img/icons/stats/stamina.png" class="vital_stamina" alt=""> <p class="stamina_cost"></p></div>'+
                '<div class="vital_cost "><img src="../img/icons/stats/mana.png" class="vital_mana" alt=""> <p class="mana_cost"></p></div>' +
            '</div>' +
            '<div class="details_detailed_label"> Description: </div>' +
            '<p class="details_skill_desc"></p>'
            );
        $('.health_cost').append("Health: "+ -infoSkill[skillName].healthCost);
        $('.stamina_cost').append("Stamina: "+ -infoSkill[skillName].staminaCost);
        $('.mana_cost').append("Mana: "+ -infoSkill[skillName].manaCost);
        $('.details_skill_desc').append(infoSkill[skillName].info);


    }, function hideDetails (){
        $('.details').css('opacity', 0);
        $('.details_detailed').empty();
    });


    $('.skill, .combat_button').click(function () {
        if (!$(this).attr("disabled")){
            // Player turn
            let skillNumber = parseInt($(this).attr('data-number'));
            let skillName = player.getSkill(skillNumber)['name'];

            // The skill will succeed or miss
            costSkillControl(skillName);

            // TODO: implement miss percentage chance

            // Deactivate the buttons
            deactivateElements();

            // Enemy turn
            enemyTurn();

            // Reduce cooldown for the next turn
            reduceSkillsCooldown();

            // Apply skill's cooldown
            setCooldownSkill(skillNumber, skillName, 'player');

            // Death control
            if (enemy.getCurrentVitals()[0] === 0) {
                deactivateElements('win')
            }
        }
    });
}



