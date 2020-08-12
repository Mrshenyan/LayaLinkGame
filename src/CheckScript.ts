import CellScript from "./CellScript";
import MainScene from "./MainScene";

export default class CheckScript extends Laya.Script {
    
    
    private static theOne:number=-1;
    private static theTwo:number=-1;
    private static type1:number = -1;
    private static type2:number = -1;
    private static pos1:Laya.Vector2 = new Laya.Vector2(-1,-1);
    private static pos2:Laya.Vector2 = new Laya.Vector2(-1,-1);
    private static Instance:CheckScript = null;
    private static CS_self:CheckScript = null;

    constructor() { super();
        if(!CheckScript.Instance)CheckScript.Instance = new CheckScript();
        CheckScript.CS_self = this;
    }
    /**
     * 
     * @param sn1 the one gem of you have clikced
     * @param sn2 
     * -1 for you have clicked one gem
     * 0 for can not eliminat
     * 1 for can elimiat
     */
    private static Check(sn1,sn2,type1,type2,pos1:Laya.Vector2,pos2:Laya.Vector2):any{
        let target1 = MainScene.MS_self.GemContain.getChildAt(sn1);
        let goCheck:boolean = false;
        let target2 = MainScene.MS_self.GemContain.getChildAt(sn2);
        if(type1!=type2&&(type1!=-1&&type2!=-1)){
            goCheck = false;
            return MainScene.MS_self.cancleChioced(sn1,sn2);
        }
        if(sn1==-1||sn2==-1){
            return -1;
        }
        if(pos2.x == pos1.x){
            goCheck = Horizon(target1,target2,pos1,pos2,true);
        }
        if(pos2.y == pos1.y){
            goCheck = Vertical(target1,target2,pos1,pos2,true);
        }
        if(!goCheck){
            goCheck = turn_once(target1,target2,pos1,pos2);
        }
        if(!goCheck){
            turn_twice(target1,target2,pos1,pos2);
        }
        /**
         * 
         * @param target1 target1
         * @param target2 target2
         * @param pos1 target1's position
         * @param pos2 target2's position
         * @param eli there are knee point or not
         */
        function Horizon(target1:Laya.Node,target2:Laya.Node,pos1,pos2,eli:boolean):any{
            if(Math.abs(pos1.x-pos2.x)==1||Math.abs(pos2.y-pos1.y)==1) return MainScene.eliminate(sn1,sn2);//相邻的情况
            let node = new Laya.Node();
            let minus = pos2.y>pos1.y?0:-1;
            for(let i=1;i<Math.abs(pos1.y-pos2.y);i++){
                let nodesn = target1.getComponent(CellScript).getGemSn();
                node = MainScene.MS_self.GemContain.getChildAt(nodesn+i*Math.pow(-1,minus));
                if(!node.getComponent(CellScript).getEliminateOrNot()){
                    console.log("不能够消除1");
                    if(eli)return false;
                }else if(eli){
                    return MainScene.eliminate(sn1,sn2);
                }
                return false;
            }
        }
        
        /**
         * 
         * @param target1 target1
         * @param target2 target2
         * @param pos1 target1's position
         * @param pos2 target2's position
         * @param eli there are knee point or not
         */
        function Vertical(target1:Laya.Node,target2:Laya.Node,pos1,pos2,eli:boolean):any{
            if(Math.abs(pos1.x-pos2.x)==1||Math.abs(pos2.y-pos1.y)==1) return MainScene.eliminate(sn1,sn2);//相邻的情况
            let node = new Laya.Node();
            let minus = pos2.x>pos1.x?0:-1;
            for(let i=1;i<Math.abs(pos2.x-pos1.x);i++){
                let nodesn = target1.getComponent(CellScript).getGemSn();
                node = MainScene.MS_self.GemContain.getChildAt(nodesn+(MainScene.MS_self.getGameLv()+1+2)*i*Math.pow(-1,minus));
                if(!node.getComponent(CellScript).getEliminateOrNot()){
                    console.log("不能够消除3");
                    if(eli)return false;
                }else if(eli){
                    return MainScene.eliminate(sn1,sn2);
                }
                return false;
            }
        }
        
        /**
         * 
         * @param target1 target1
         * @param target2 target2
         * @param pos1 target1's position
         * @param pos2 target2's position
         */
        function turn_once(target1:Laya.Node,target2:Laya.Node,pos1,pos2):any{
            console.log("进入有1个拐点的情况");
            let pos3 = new Laya.Vector2(pos1.x,pos2.y);
            let pos4 = new Laya.Vector2(pos2.x,pos1.y);
            let target3 = MainScene.MS_self.GemContain.getChildAt((pos3.x+1)*MainScene.MS_self.getGameLv()+pos3.y);
            let target4 = MainScene.MS_self.GemContain.getChildAt((pos4.x+1)*MainScene.MS_self.getGameLv()+pos4.y);
            if(Horizon(target1,target3,pos1,pos3,false)&&Vertical(target3,target2,pos3,pos2,false)){
                goCheck = true;
                return MainScene.eliminate(sn1,sn2);
            }
            if(Horizon(target2,target4,pos2,pos4,false)&&Vertical(target4,target1,pos4,pos1,false)){
                goCheck = true;
                return MainScene.eliminate(sn1,sn2);
            }
            return false;
        }

        /**
         * 
         * @param target1 target1
         * @param target2 target2
         * @param pos1 target1's position
         * @param pos2 target2's position
         * @param eli there are knee point or not
         */
        function turn_twice(target1:Laya.Node,target2:Laya.Node,pos1,pos2){
            console.log("进入有2个拐点的情况");
            return false;
        }
    }



    /**
     * @param type type of the gem that you have clicked
     * @param sn  sn of the gem that you have clicked
     */
    public static eliminate(type:number,sn:number,pos:Laya.Vector2):number{
        let returnValue = -1;
        if(this.theOne==-1){
            this.theOne = sn;
            this.type1 = type;
            this.pos1 = pos;
        }else{
            this.theTwo = sn;
            this.type2 = type;
            this.pos2 = pos;
        }
        returnValue = this.Check(this.theOne,this.theTwo,this.type1,this.type2,this.pos1,this.pos2);
        return returnValue;
    }
    public static reSet(){
        console.log("重置");
        this.theOne = this.theTwo = this.type1 = this.type2 = -1;
        this.pos1 = this.pos2 = new Laya.Vector2(-1, -1);
    }
}