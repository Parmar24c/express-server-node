class User {
    constructor(id, name, active = true){
        this.id = id;
        this.name = name;
        this.active = active;
    }
}

module.exports = { User }; 