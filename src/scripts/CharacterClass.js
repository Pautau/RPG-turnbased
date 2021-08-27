class Character {
    // Name and type (player or enemy)
    #name;          #type;
    // Vitals
    #maxHealth;     #currentHealth;
    #maxStamina;    #currentStamina;
    #maxMana;       #currentMana;
    // Stats
    #stats = [];
    // Skills
    #skillOne;      #skillTwo;
    #skillThree;    #skillFour;
    #skillFive;
    // Combat buttons
    #skip;          #inspect;
    #flee;


    constructor(name, maxHealth, maxStamina, maxMana, type = "enemy", strength, dexterity, intelligence, criticalChance,) {
        this.#name = name;                  this.#type = type;
        this.#maxHealth = maxHealth;        this.#currentHealth = maxHealth;
        this.#maxStamina = maxStamina;      this.#currentStamina = maxStamina;
        this.#maxMana = maxMana;            this.#currentMana = maxMana;
        this.#stats = [strength, dexterity, intelligence, criticalChance];

        this.#skip = useSkill;
    }

    // Alter vital (health, stamina, mana)
    alterVital(amount, vital) {
        switch (vital) {
            case 0:
                this.#currentHealth += amount;
                break;
            case 1:
                this.#currentStamina += amount;
                break;
            case 2:
                this.#currentMana += amount;
                break;
        }
        this.controlThreshold(vital);
        this.displayBarString(vital);
        this.displayBarLength(vital);
        return amount;
    }

    // Prevent from falling under 0% and jumping above the 100%
    controlThreshold(vital) {
        switch (vital) {
            case 0:
                this.#currentHealth = (this.#currentHealth > this.#maxHealth) ? this.#maxHealth : this.#currentHealth;
                this.#currentHealth = (this.#currentHealth < 0) ? 0 : this.#currentHealth;
                break;
            case 1:
                this.#currentStamina = (this.#currentStamina > this.#maxStamina) ? this.#maxStamina : this.#currentStamina;
                this.#currentStamina = (this.#currentStamina < 0) ? 0 : this.#currentStamina;
                break;
            case 2:
                this.#currentMana = (this.#currentMana > this.#maxMana) ? this.#maxMana : this.#currentMana;
                this.#currentMana = (this.#currentMana < 0) ? 0 : this.#currentMana;
                break;
        }
    }

    // Display inside each bar the value of its vital PlUS adjust its length according to its percentage
    displayAll() {
        this.displayBarString(0);
        this.displayBarString(1);
        this.displayBarString(2);

        this.displayBarLength(0);
        this.displayBarLength(1);
        this.displayBarLength(2);
    }

    // Display inside its the vital bar a text of the current, max and percentage of each vital "75/75 | 100%"
    displayBarString(vital) {
        let vitalElement;
        switch (vital) {
            case 0:
                vitalElement = document.getElementById('int_' + this.#type + '_health');
                vitalElement.innerHTML = this.#currentHealth + "/" + this.#maxHealth + " | " + this.getPercentageVitals()[vital] + "%";
                break;
            case 1:
                vitalElement = document.getElementById('int_' + this.#type + '_stamina');
                vitalElement.innerHTML = this.#currentStamina + "/" + this.#maxStamina + " | " + this.getPercentageVitals()[vital] + "%";
                break;
            case 2:
                vitalElement = document.getElementById('int_' + this.#type + '_mana');
                vitalElement.innerHTML = this.#currentMana + "/" + this.#maxMana + " | " + this.getPercentageVitals()[vital] + "%";
                break;
        }
    }

    displayBarLength(vital) {
        let vitalBar;
        switch (vital) {
            case 0:
                vitalBar = document.getElementById(this.#type + '_current_' + 'health');
                vitalBar.style.width = this.getPercentageVitals(vital)[vital] + '%'; break;
            case 1:
                vitalBar = document.getElementById(this.#type + '_current_' + 'stamina');
                vitalBar.style.width = this.getPercentageVitals(vital)[vital] + '%'; break;
            case 2:
                vitalBar = document.getElementById(this.#type + '_current_' + 'mana');
                vitalBar.style.width = this.getPercentageVitals(vital)[vital] + '%'; break;
        }
    }

    getName() {
        return this.#name;
    }

    /* Getters vitals
    * INDEX:
    * 0 = Health
    * 1 = Stamina
    * 2 = Mana
    * */
    getCurrentVitals() {
        return [this.#currentHealth, this.#currentStamina, this.#currentMana]
    }

    getMaxVitals() {
        return [this.#maxHealth, this.#maxStamina, this.#maxMana]
    }

    getPercentageVitals() {
        let percentagesVital = [];
        // avoid getting "NaN" as percentage
        for (let i=0; i<3; i++) {
            if(this.getMaxVitals(i)[i] > 0){
                percentagesVital.push(Math.round((this.getCurrentVitals()[i] / this.getMaxVitals()[i] * 100)));
            } else {
                percentagesVital.push(0);
            }
        }
        return percentagesVital;
    }

    /* Getters stats
    * INDEX:
    * 0 = Strength
    * 1 = Dexterity
    * 2 = Intelligence
    * 3 = Critical chance
    */
    getStats() {
        return this.#stats;
    }

    getSkill(skillNumber){
        switch (skillNumber) {
            case 1: return this.#skillOne;
            case 2: return this.#skillTwo;
            case 3: return this.#skillThree;
            case 4: return this.#skillFour;
            case 5: return this.#skillFive;
            case 6: return this.#skip;
            case 7: return this.#inspect;
            case 8: return this.#flee;
        }
    }

    reduceSkillCooldown(skillNumber){
        switch (skillNumber) {
            case 1: this.#skillOne['cooldown'] -- ; break;
            case 2: this.#skillTwo['cooldown'] -- ; break;
            case 3: this.#skillThree['cooldown'] -- ; break;
            case 4: this.#skillFour['cooldown'] -- ; break;
            case 5: this.#skillFive['cooldown'] -- ; break;
        }
    }

    /* Setter Skills */
    setSkill(skillName, skillNumber){
        switch (skillNumber) {
            case 1: this.#skillOne = this.setSkillObject(skillName); break;
            case 2: this.#skillTwo = this.setSkillObject(skillName); break;
            case 3: this.#skillThree = this.setSkillObject(skillName); break;
            case 4: this.#skillFour = this.setSkillObject(skillName); break;
            case 5: this.#skillFive = this.setSkillObject(skillName); break;
            case 6: this.#skip = this.setSkillObject(skillName); break;
            case 7: this.#inspect = this.setSkillObject(skillName); break;
            case 8: this.#flee = this.setSkillObject(skillName);
        }
    }

    setSkillObject(skillName){
        return {
            name: skillName,
            healthCost: infoSkill[skillName]['healthCost'],
            staminaCost: infoSkill[skillName]['staminaCost'],
            manaCost: infoSkill[skillName]['manaCost'],
            cooldown: 0,
        };
    }

}

/**/

function randomizeMinMax(min, max) {
    return Math.floor(Math.random() * (max- min + 1) + min);
}

let playerHealth = randomizeMinMax(250, 400);
let playerStamina = randomizeMinMax(100, 150);
let playerStrength = randomizeMinMax(7,10)

let enemyHealth = randomizeMinMax(500, 1000);
let enemyStamina = randomizeMinMax(100, 150);
let enemyStrength = randomizeMinMax(5,12)

let player = new Character('Pautau', playerHealth, playerStamina, 0, "player",
playerStrength, 7, 1, 10);


let enemy = new Character('Merihem', enemyHealth, enemyStamina, 0, "enemy",
enemyStrength, 0, 1, 5);

enemy.setSkill('basicSlash', 1);
enemy.setSkill('powerSlash', 2);


player.setSkill('basicSlash', 1);
player.setSkill('powerSlash', 2);
player.setSkill('finalBlow', 3);
player.setSkill('allForOne', 4);
player.setSkill('recover', 5);
player.setSkill('skip', 6);
player.setSkill('inspect', 7);
player.setSkill('flee', 8);
