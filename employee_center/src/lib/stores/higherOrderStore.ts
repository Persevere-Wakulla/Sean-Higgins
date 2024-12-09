import { get, writable, type Writable } from "svelte/store";

export const undoStore = (store: Writable<any>)=> {
    const history: any[] = [];
    let historyIndex = -1;
    return {
        subscribe: store.subscribe,
        doAction(action: any){
            historyIndex++;
            history[historyIndex] = action;
            while(historyIndex < historyIndex - 1){
                history.pop();
            }
            store.update(value => action.apply(value));
        },
        undo(){
            if(historyIndex >= 0){
                store.update(value => history[historyIndex].reverse(value));
                historyIndex--;
            }
        },
        redo(){
            if(historyIndex < history.length - 1){
                historyIndex++;
                store.update(value => history[historyIndex].apply(value));
            }
        },
        storeHistory(value){
            return this.doAction({
                apply(_value) {return _value = value},
                reverse(_value) {return _value = value}
            })
        }
    }
}

export const undoSecond = (store: Writable<any>) => {
    const history: any[] = [get(store)];
    const historyStore = writable(history);
    let historyIndex = 0;
    const updateStore = () => store.set(history[historyIndex]);
    return {
        subscribe: store.subscribe,
        history: historyStore,
        set(newValue) {
            historyIndex++;
            history[historyIndex] = newValue;
            historyStore.set(history)
            while(historyIndex < historyIndex - 1){
                history.pop();
            }
            updateStore()
        },
        undo(){
            if(historyIndex > 0){
                historyIndex--;
                updateStore()
            }
        },
        redo(){
            if(historyIndex < history.length - 1){
                historyIndex++;
                updateStore()
            }
        },
    }
}
