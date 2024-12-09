import { reactive } from 'vue';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs';


export const store = reactive({
    itemsInCart: []
    
});