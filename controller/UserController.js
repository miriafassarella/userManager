class UserController{

    constructor(formId, formIdUpdate, tableId){

        this.formEl = document.getElementById(formId);
        this.formIdUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();

    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{

            this.showPanelCreate();
        });

        this.formIdUpdateEl.addEventListener("submit", event=>{

            event.preventDefault();
            let btn = this.formIdUpdateEl.querySelector("[type=submit]");

            btn.disabled = true;
            let values = this.getValues(this.formIdUpdateEl);

            let index = this.formIdUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            //replace the values that exist in the previously typed attribute
            let result = Object.assign({}, userOld, values);//copy the value of an attribute from an object

            this.getPhoto(this.formIdUpdateEl).then(
        (content)=>{

            if(!values.photo) { 
                 result._photo = userOld._photo;
            }else{
                result._photo = content;
            }

            let user = new User();

            user.loadFromJSON(result);

            user.save();

            this.getTr(user, tr);

            this.updateCount();
            
            this.formIdUpdateEl.reset();

            btn.disabled = false;

            this.showPanelCreate();
            }, 
        (e)=>{

            console.error(e);
    });

    this.showPanelCreate();

        });

        
    }

    onSubmit(){

        this.formEl.addEventListener("submit", event =>{

            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formEl);

            if(!values) return false; //stopping form execution

           this.getPhoto(this.formEl).then(//if all goes well do it
            (content)=>{
                values.photo = content; //the content function refers to the result

                values.save();
                    
                this.addLine(values);

                this.formEl.reset();//cleaning form

                btn.disabled = false;
                }, 
            (e)=>{

                console.error(e);//displays an error message and also generates in the console
        });

            });

    }

    getPhoto(formEl){

        return new Promise((resolve, reject)=>{//performing an asynchronous activity

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item=>{//spread operator
    
                 if(item.name === 'photo'){
                     return item;
                 }
    
            });
            let file = elements[0].files[0];//specifying the element to be loaded
            
            //happens later
            fileReader.onload = ()=>{//loading copy
                
                resolve(fileReader.result); //the result refers to the copy of the image
                
            };
            
            fileReader.onerror = (e)=>{

                reject(e);//when you finish loading the image do this

            };
            if(file){ 
    
            fileReader.readAsDataURL(file);//reading the file
            }else{
                resolve('dist/img/boxed-bg.jpg');//attach this file when no file is selected
            }
         });

        }

    getValues(formEl){

        let user = {}; //only exists within the getValues
        let isValid = true;

        //making an array
        [...formEl.elements].forEach(function(field, index){

            //Is this the field I'm looking for and isn't it empty?
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){//form validation

                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if(field.name == 'gender'){
        
                if(field.checked){
        
                    user[field.name] = field.value;
        
                }
            }else if(field.name == "admin"){//treating the admin selector

                    user[field.name] = field.checked;
                }else{
        
                user[field.name] = field.value;
            }
        
        });

        if(!isValid){
            return false; //stopping form execution
    }
        
        return new User(user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
            
        ); //from now on, objectUser is an object

        

    }//closing the getValues

    

    selectAll(){
       let users = User.getUsersStorage();

       users.forEach(dataUser=>{

        let user = new User;

        user.loadFromJSON(dataUser);

        this.addLine(user);
        

       })

}
    addLine(dataUser){

        let tr = this.getTr(dataUser);

        this.tableEl.appendChild(tr);

        this.updateCount();

    }
    
   getTr(dataUser, tr = null){

           if(tr === null) tr = document.createElement('tr');

           tr.dataset.user = JSON.stringify(dataUser);// dataset just keep string, so the JSON.stringfy convert object to string in JSON

            tr.innerHTML = `
            
            <tr>
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
            </tr>              
            `;
            this.addEventsTr(tr);
    
                return tr;
   } 

    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", e=>{

            if(confirm("Deseja realmente excluir?")) {//open a confirmation window

                let user = new User();

                user.loadFromJSON(JSON.parse(tr.dataset.user));

                user.removeLocal();

                tr.remove(); // remove an item from array
                this.updateCount();

            }
});

        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            let json = JSON.parse(tr.dataset.user);
            
    
                this.formIdUpdateEl.dataset.trIndex = tr.sectionRowIndex;
    
                for(let name in json){
    
                    let field = this.formIdUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");
                            
                        if(field){
                          
                                 switch (field.type){
                                    case 'file':
                                        continue;
                                        break;
                                    case 'radio':
                                            field = this.formIdUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                                                field.checked = true;
                                        break;
                                    case 'checkbox':
                                            field.checked = json[name];
                                        break;
    
                                        default:
                                                field.value = json[name];
                                }
    
                           }
                    
                        }
            this.formIdUpdateEl.querySelector(".photo").src = json._photo;
    
            this.showPanelUpdate();
        })

    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }

    updateCount(){ //counting the number of users

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{

                numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if(user._admin) numberAdmin++;

        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }
    

}//closing the class
