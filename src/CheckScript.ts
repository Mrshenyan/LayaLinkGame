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
    /**关卡横向格子数 */
    private static GameLv =0;
   
    constructor() { super();
        // if(!CheckScript.Instance)CheckScript.Instance = new CheckScript();
        // CheckScript.CS_self = this;
    } 
    
    onAwake(){
        if(!CheckScript.Instance)CheckScript.Instance = new CheckScript();
        CheckScript.CS_self = CheckScript.Instance;
    }

    /**
     * 
     * @param sn1 target1's sn
     * @param sn2 target2's sn
     * @param type1 target1's type
     * @param type2 target2's type
     * @param pos1 target1's pos
     * @param pos2 target2's pos
     */
    private static Check(sn1,sn2,type1,type2,pos1:Laya.Vector2,pos2:Laya.Vector2):any{
        let target1 = MainScene.MS_self.GemContain.getChildAt(sn1);
        let goCheck:boolean = false;
        let target2 = MainScene.MS_self.GemContain.getChildAt(sn2);
        let t1Nodes_H:Laya.Node = new Laya.Node();//target1的左右
        let t2Nodes_H:Laya.Node = new Laya.Node();//target2的左右

        /**如有，第二个拐点 */
        let zhedian2
        if(type1!=type2&&(type1!=-1&&type2!=-1)){
            goCheck = false;
            return MainScene.MS_self.cancleChioced(sn1,sn2);
        }
        if(sn1==-1||sn2==-1){
            return -1;
        }
        if(pos2.x == pos1.x){
            Horizon(target1,target2,pos1,pos2,true);
        }
        if(pos2.y == pos1.y){
            Vertical(target1,target2,pos1,pos2,true);
        }
        if(!goCheck){
            turn_once(target1,target2,pos1,pos2,true);
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
         * @param eli true 代表是直接调用而不是由其他函数调用
         */
        function Horizon(target1:Laya.Node,target2:Laya.Node,pos1,pos2,eli:boolean):any{
            if(pos2.x==pos1.x){//同行
                if((Math.abs(pos1.y-pos2.y)==1)){//相邻
                    if(eli){
                        goCheck = true;
                        return MainScene.eliminate(sn1,sn2);
                    }else{
                        return true;
                    }
                }else{//不相邻
                    let minsn = (pos2.y > pos1.y) ? target1.getComponent(CellScript).getGemSn():target2.getComponent(CellScript).getGemSn();
                    for(let i=1;i<(Math.abs(pos2.y-pos1.y));i++){
                        let sn = minsn +i;
                        let node = MainScene.MS_self.GemContain.getChildAt(sn);
                        if(node.getComponent(CellScript).getEliminateOrNot()){
                            if(i==(Math.abs(pos2.y-pos1.y)-1)){
                                if(eli){
                                    goCheck = true;
                                    return MainScene.eliminate(sn1,sn2);//相邻的情况，主动消除
                                }else{
                                    return true;
                                }
                            }
                            else{
                                continue
                            }
                        }else{
                            return MainScene.MS_self.cancleChioced(sn1,sn2);
                        }
                    }
                }
            }
        }
        
        /**
         * 
         * @param target1 target1
         * @param target2 target2
         * @param pos1 target1's position
         * @param pos2 target2's position
         * @param eli true 代表是直接调用而不是由其他函数调用
         */
        function Vertical(target1:Laya.Node,target2:Laya.Node,pos1,pos2,eli:boolean):any{
            if(pos1.y == pos2.y){
                if((Math.abs(pos2.x-pos1.x)==1)){//相邻的情况
                    if(eli){
                        goCheck = true;
                        return MainScene.eliminate(sn1,sn2);//主动相邻
                    }else{
                        return true;//调用相邻
                    }
                }else{//不相邻
                    let minsn = (pos2.x > pos1.x) ? target1.getComponent(CellScript).getGemSn():target2.getComponent(CellScript).getGemSn();
                    for(let i=0;i<Math.abs(pos1.x-pos2.x);i++){
                        let sn =minsn+i*CheckScript.GameLv;
                        let node = MainScene.MS_self.GemContain.getChildAt(sn);
                        if(node.getComponent(CellScript).getEliminateOrNot()){
                            if(i==(Math.abs(pos2.x-pos1.x)-1)){
                                if(eli){
                                    goCheck = true;
                                    return MainScene.eliminate(sn1,sn2);//不相邻的情况，主动
                                }else{
                                    return true;
                                }
                            }else{
                                continue
                            }
                        }else{
                            return MainScene.MS_self.cancleChioced(sn1,sn2);
                        }
                    }
                }
            }
        }
        
        /**
         * 
         * @param target1 target1
         * @param target2 target2
         * @param pos1 target1's position
         * @param pos2 target2's position
         * @param eli true 代表是直接调用而不是由其他函数调用
         */
        function turn_once(target1:Laya.Node,target2:Laya.Node,pos1,pos2,eli:boolean):any{
            console.log("进入有1个拐点的情况");
            let pos3 = new Laya.Vector2(pos1.x,pos2.y);
            let pos4 = new Laya.Vector2(pos2.x,pos1.y);
            let sn3 = pos3.x*(CheckScript.GameLv)+pos3.y;
            let sn4 = pos4.x*(CheckScript.GameLv)+pos4.y;
            let target3 = MainScene.MS_self.GemContain.getChildAt(sn3);
            let target4 = MainScene.MS_self.GemContain.getChildAt(sn4);
            if(target3.getComponent(CellScript).getEliminateOrNot()){//折点已经消除了才可以进行下一步
                let arg1 = Horizon(target3,target1,pos3,pos1,false);
                let arg2 = Vertical(target2,target3,pos2,pos3,false);
                if(arg1&&arg2){
                    if(eli){
                        goCheck = true;
                        zhedian2 = target3.getComponent(CellScript).getCellPos();
                        CheckScript.CS_self.DrawLine(target1,target2,target3);
                        return MainScene.eliminate(sn1,sn2);
                    }else{
                        zhedian2 = target3.getComponent(CellScript).getCellPos();
                        return true;
                    }
                }
            }
            if(target4.getComponent(CellScript).getEliminateOrNot()){//折点已经消除了才可以进行下一步
                let arg1 = Horizon(target4,target2,pos4,pos2,false);
                let arg2 = Vertical(target1,target4,pos1,pos4,false);
                if(arg1&&arg2){
                    if(eli){
                        goCheck = true;
                        zhedian2 = target4.getComponent(CellScript).getCellPos();
                        CheckScript.CS_self.DrawLine(target1,target2,target4);
                        return MainScene.eliminate(sn1,sn2);
                    }else{
                        zhedian2 = target4.getComponent(CellScript).getCellPos();
                        return true;
                    }
                }
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
        function turn_twice(target1:Laya.Node,target2:Laya.Node,pos1:Laya.Vector2,pos2:Laya.Vector2){
            console.log("进入有2个拐点的情况");
            if(!turn_twice_HScan(target1,target2,t1Nodes_H,pos1,pos2)){
                turn_twice_HScan(target2,target1,t2Nodes_H,pos2,pos1);
            }
            if(!turn_twice_VScan(target1,target2,t1Nodes_H,pos1,pos2)){
                turn_twice_VScan(target2,target1,t2Nodes_H,pos2,pos1);
            }
            return false;

        }

        /**
         * 两个拐点，扫描查找
         * @param target1 
         * @param target2 
         * @param HScanNode 
         * @param pos1 
         * @param pos2 
         */
        function turn_twice_HScan(target1:Laya.Node,target2:Laya.Node,HScanNode:Laya.Node,pos1:Laya.Vector2,pos2:Laya.Vector2){
            for(let i=0;i<(CheckScript.GameLv);i++){//扫描target1同行节点与target2是否存在单拐点情况
                let HScanPos:Laya.Vector2=new Laya.Vector2();
                HScanNode = MainScene.MS_self.GemContain.getChildAt(pos1.x*(CheckScript.GameLv)+i);
                let HSSN = HScanNode.getComponent(CellScript).getGemSn();
                HScanPos = HScanNode.getComponent(CellScript).getCellPos();
                if((HScanNode.getComponent(CellScript).getEliminateOrNot())&&turn_once(HScanNode,target2,HScanPos,pos2,false)){
                    //存在单拐点,进行
                    console.log("存在与target1同行与target2单拐点的点",HScanNode);
                    CheckScript.CS_self.DrawLine(pos1,pos2,HScanPos,zhedian2);
                    goCheck = true;
                    MainScene.eliminate(sn1,sn2);
                    return true;
                }
            }
            //循环结束，target1不存在点满足条件，扫描target2同行点
            // return false;
        }

        function turn_twice_VScan(target1:Laya.Node,target2:Laya.Node,VScanNode:Laya.Node,pos1:Laya.Vector2,pos2:Laya.Vector2){
            for(let i=0;i<(CheckScript.GameLv);i++){//扫描target1同行节点与target2是否存在单拐点情况
                let VScanPos:Laya.Vector2=new Laya.Vector2();
                let t1SN = target1.getComponent(CellScript).getGemSn();
                VScanNode = MainScene.MS_self.GemContain.getChildAt(t1SN+i);
                let HSSN = VScanNode.getComponent(CellScript).getGemSn();
                VScanPos = VScanNode.getComponent(CellScript).getCellPos();
                if((VScanNode.getComponent(CellScript).getEliminateOrNot())&&turn_once(VScanNode,target2,VScanPos,pos2,false)){
                    //存在单拐点,进行
                    console.log("存在与target1同行与target2单拐点的点",VScanNode);
                    CheckScript.CS_self.DrawLine(pos1,pos2,VScanPos,zhedian2);
                    goCheck = true;
                    MainScene.eliminate(sn1,sn2);
                    return true;
                }
            }
            //循环结束，target1不存在点满足条件，扫描target2同行点
            // return false;
        }


        
    }

    /**
     * 划线
     * @param startPos 起点
     * @param endPos 终点
     * @param arg1 折点1
     * @param arg2 折点2
     */
    public DrawLine(startPos,endPos,arg1?,arg2?){
        console.log(startPos)
        console.log(endPos)
        console.log(arg1)
        console.log(arg2)
    }

    /**
     * @param type type of the gem that you have clicked
     * @param sn  sn of the gem that you have clicked
     */
    public static eliminate(type:number,sn:number,pos:Laya.Vector2):number{
        if(!CheckScript.Instance){
            CheckScript.Instance = new CheckScript();
            CheckScript.CS_self =  CheckScript.Instance ;
        }
        CheckScript.GameLv = MainScene.MS_self.getGameLv()+1+2
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