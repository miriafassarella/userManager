class UserController{

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();

    }

    onSubmit(){

        this.formEl.addEventListener("submit", event =>{

            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues();

            if(!values) return false; //stopping form execution

           this.getPhoto().then(//if all goes well do it
            (content)=>{
                values.photo = content; //the content function refers to the result
                    
                this.addLine(values);

                this.formEl.reset();//cleaning form

                btn.disabled = false;
                }, 
            (e)=>{

                console.error(e);//displays an error message and also generates in the console
        });

            });

    }

    getPhoto(){

        return new Promise((resolve, reject)=>{//performing an asynchronous activity

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item=>{//spread operator
    
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

    getValues(){

        let user = {}; //only exists within the getValues
        let isValid = true;

        //making an array
        [...this.formEl.elements].forEach(function(field, index){

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

    addLine(dataUser){

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);// dataset just keep string, so the JSON.stringfy convert object to string in JSON


     tr.innerHTML = `
    
    <tr>
    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
    <td>${dataUser.name}</td>
    <td>${dataUser.email}</td>
    <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
    <td>${Utils.dateFormat(dataUser.register)}</td>
    <td>
        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>
    </tr>              
    `;
    
    this.tableEl.appendChild(tr);

        this.updateCount();

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