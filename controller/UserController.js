class UserController{

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();

    }

    onSubmit(){

        this.formEl.addEventListener("submit", event =>{

            event.preventDefault();

            let values = this.getValues();

           this.getPhoto().then(
            (content)=>{
                values.photo = content; //the content function refers to the result
                    
                this.addLine(values);
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

                reject(e);

            }
    
            fileReader.readAsDataURL(file);//reading the file
    
         });

        }

    getValues(){

        let user = {}; //only exists within the getValues

        //making an array
        [...this.formEl.elements].forEach(function(field, index){

            if(field.name == 'gender'){
        
                if(field.checked){
        
                    user[field.name] = field.value;
        
                }
        
            }else{
        
                user[field.name] = field.value;
            }
        
        });
        
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

     this.tableEl.innerHTML = `
    
    <tr>
    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
    <td>${dataUser.name}</td>
    <td>${dataUser.email}</td>
    <td>${dataUser.admin}</td>
    <td>${dataUser.birth}</td>
    <td>
        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>
    </tr>              
    `;
    
    
    }

    

}//closing the class