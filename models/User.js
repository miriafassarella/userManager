class User{

    constructor(name, gender, birth, country, email, password, photo, admin){
//the underline is just a convention
        this._id;
        this._name = name; //saving parameters in variables
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    get id(){
        return this._id;
    }
    get register(){
        return this._register;
    }
    get name(){
        return this._name;
    }
    get gender(){
        return this._gender;
    }
    get birth(){
        return this_birth;
    }
    get country(){
        return this._country;
    }
    get email(){
        return this._email;
    }
    get password(){
        return this._password;
    }
    get photo(){
        return this._photo;
    }
    get admin(){
        return this._admin;
    }
    set photo(value){
        this._photo = value;
    }

    loadFromJSON(json){ //walk through each object

        for(let name in json){

            switch(name){

                case '_register':
                        this[name] = new Date(json[name]);
                    break;
                    default:
                        this[name] = json[name];
            }

            

        }

    }
  static  getUsersStorage(){

        let users = [];

        if(localStorage.getItem("users")){

            users = JSON.parse(localStorage.getItem("users"));

        }

        return users;
    }

    getNewId(){

        if(!window.id) window.id = 0;

        id++;

        return id;

    }

    save(){

        let users = User.getUsersStorage();

        if(this.id > 0){

            users.map(u=>{

                if(u._id === this.id){

                    u = this;

                }

                return u;

            });

          

        }else{

            this._id = this.getNewId();


        users.push(this);

        

        }
        //first enter the name of the key, second is the value
        //sessionStorage.setItem("user", JSON.stringify(users)); writes data to the section.  If you close the browser, it no longer exists
        localStorage.setItem("users", JSON.stringify(users)); //writes data to localStorage
       



    }
}
