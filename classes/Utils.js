class Utils{

   static dateFormat(date){
            //static method, we don't create instance of class
        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();

    }

}