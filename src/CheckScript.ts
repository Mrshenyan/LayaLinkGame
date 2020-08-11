import CellScript from "./CellScript";
import MainScene from "./MainScene";

export default class CheckScript extends Laya.Script {
    
    constructor() { super(); }
    
    static theOne:number=-1;
    static theTwo:number=-1;
    static type1:number = -1;
    static type2:number = -1;
    

    /**
     * 
     * @param sn1 the one gem of you have clikced
     * @param sn2 
     * -1 for you have clicked one gem
     * 0 for can not eliminat
     * 1 for can elimiat
     */
    private static Check(sn1,sn2,type1,type2):any{
        if(type1!=type2&&(type1!=-1&&type2!=-1))return MainScene.MS_self.cancleChioced(sn1,sn2);
        if(sn1==-1||sn2==-1){
            return -1;
        }
        return MainScene.eliminate(sn1,sn2);


        function right(){
            
        }

        function left(){

        }
    }
    
    /**
     * @param type type of the gem that you have clicked
     * @param sn  sn of the gem that you have clicked
     */
    public static eliminate(type,sn):number{
        let returnValue = -1;
        if(this.theOne==-1){
            this.theOne = sn;
            this.type1 = type;
        }else{
            this.theTwo = sn;
            this.type2 = type;
        }
        returnValue = this.Check(this.theOne,this.theTwo,this.type1,this.type2);
        return returnValue;
    }
    public static reSet(){
        this.theOne = -1;
        this.theTwo = -1;
        this.type1 = -1;
        this.type2 = -1;
    }
}