import CellScript from "./CellScript";
import MainScene from "./MainScene";

export default class CheckScript extends Laya.Script {
    
    /**目标点的序号 */
    private static theOne:number=-1;
    private static theTwo:number=-1;
    /**目标点的类型 */
    private static type1:number = -1;
    private static type2:number = -1;
    /**目标点1的pos（行列表示） */
    private static pos1:Laya.Vector2 = new Laya.Vector2(-1,-1);
    /**目标点2的pos（行列表示）*/
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
        let dx = 1;
        let dy = 6;
        /**目标点之间的阻碍物个数 */
        let blockCount=0;
        /**如有，第二个拐点 */
        let zhedian2:Laya.Vector2=new Laya.Vector2(-1,-1);
        if(type1!=type2&&(type1!=-1&&type2!=-1)){
            goCheck = false;
            return MainScene.cancleChioced(sn1,sn2);
        }
        if(sn1==-1||sn2==-1){
            return -1;
        }
        if(pos2.x == pos1.x){
            Horizon(target1,target2,pos1,pos2,true,true);
        }
        if(pos2.y == pos1.y){
            Horizon(target1,target2,pos1,pos2,true,false);
            // Vertical(target1,target2,pos1,pos2,true);
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
        function Horizon(target1:Laya.Node,target2:Laya.Node,pos1,pos2,eli:boolean,hv?:boolean):any{
            blockCount = 0;
            /**动态扫描点 */
            let node:Laya.Node;
            let sn = Math.min(target1.getComponent(CellScript).getGemSn(),target2.getComponent(CellScript).getGemSn());
            let nodesn = sn;
            let delat = hv?Math.abs(pos1.y-pos2.y):Math.abs(pos1.x-pos2.x);
            for(let i=1;i<delat;i++){
                nodesn = sn;
                if(hv){
                    nodesn+=(i*dx);
                }else{
                    nodesn+=(i*dy);
                }
                node = MainScene.MS_self.GemContain.getChildAt(nodesn);
                if(node.getComponent(CellScript).getEliminateOrNot()){
                    if(i==(delat-1)){
                        if(eli&&blockCount==0){
                            goCheck = true;
                            MainScene.eliminate(sn1,sn2);
                            MainScene.MS_self.DrawLine(sn1,sn2);
                            return true;
                        }
                        if(!eli&&blockCount==0)return true;
                    }
                }else{
                    blockCount++;
                }
            }
            if(delat==1){
                if(eli){
                    goCheck=true;
                    MainScene.eliminate(sn1,sn2);
                    MainScene.MS_self.DrawLine(sn1,sn2);
                    return;
                }else{
                    return true;
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
            /**可能的拐点3 */
            let pos3 = new Laya.Vector2(pos1.x,pos2.y);
            /**可能的拐点4 */
            let pos4 = new Laya.Vector2(pos2.x,pos1.y);
            let sn3 = pos3.x*(CheckScript.GameLv)+pos3.y;
            let sn4 = pos4.x*(CheckScript.GameLv)+pos4.y;
            let target3 = MainScene.MS_self.GemContain.getChildAt(sn3);//两个拐点
            let target4 = MainScene.MS_self.GemContain.getChildAt(sn4);
            if(target3.getComponent(CellScript).getEliminateOrNot()){//折点已经消除了才可以进行下一步
                let arg1 = Horizon(target3,target1,pos3,pos1,false,true);
                let arg2 =  Horizon(target3,target2,pos3,pos2,false,false);
                if(arg1&&arg2){
                    if(eli){
                        goCheck = true;
                        zhedian2 = target3.getComponent(CellScript).getGemSn();
                        MainScene.MS_self.DrawLine(sn1,sn2,sn3);
                        return MainScene.eliminate(sn1,sn2);
                    }else{
                        zhedian2 = target3.getComponent(CellScript).getGemSn();
                        return true;
                    }
                }
            }
            if(target4.getComponent(CellScript).getEliminateOrNot()){//折点已经消除了才可以进行下一步
                let arg1 = Horizon(target4,target2,pos4,pos2,false,true);
                let arg2 =  Horizon(target4,target1,pos4,pos1,false,false);
                if(arg1&&arg2){
                    if(eli){
                        goCheck = true;
                        zhedian2 = target4.getComponent(CellScript).getGemSn();
                        MainScene.MS_self.DrawLine(sn1,sn2,sn4);
                        return MainScene.eliminate(sn1,sn2);
                    }else{
                        zhedian2 = target4.getComponent(CellScript).getGemSn();
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
            console.log("进入有2个拐点的情况",pos1,pos2);
            if(!turn_twice_HScan(target1,target2,t1Nodes_H,pos1,pos2)){
                turn_twice_VScan(target1,target2,t2Nodes_H,pos1,pos2);
            }
            return false;

        }

        /**
         * 两个拐点，扫描查找
         * @param target1 目标点1
         * @param target2 目标点2
         * @param HScanNode 横向扫描点
         * @param pos1 
         * @param pos2 
         */
        function turn_twice_HScan(target1:Laya.Node,target2:Laya.Node,HScanNode:Laya.Node,pos1:Laya.Vector2,pos2:Laya.Vector2){
            /**target1，target2横向扫描对应点 */
            let H_flag_r;
            /**target1，target2纵向扫描对应点 */
            let H_flag_L;
            /**target1，target2拐点扫描对应点 */
            let V_flag_r;
            for(let i=0;i<(CheckScript.GameLv);i++){//扫描target1同行节点与target2是否存在单拐点情况
                let HScanPos:Laya.Vector2=new Laya.Vector2();
                let HSSN:number=-1;
                HScanNode = MainScene.MS_self.GemContain.getChildAt(pos1.x*(CheckScript.GameLv)+i);
                HScanPos = HScanNode.getComponent(CellScript).getCellPos();
                HSSN = HScanNode.getComponent(CellScript).getGemSn();
                if(HScanNode.getComponent(CellScript).getEliminateOrNot()){
                    H_flag_r = Horizon(HScanNode,target1,HScanPos,pos1,false,true);
                    H_flag_L = Horizon(HScanNode,target1,HScanPos,pos1,false,false);
                    V_flag_r = turn_once(HScanNode,target2,HScanPos,pos2,false)
                    if((H_flag_r&&V_flag_r)||(H_flag_L&&V_flag_r)){
                        console.log("存在与target1同行与target2单拐点的点",HScanNode);
                        MainScene.MS_self.DrawLine(sn1,sn2,HSSN,zhedian2);
                        goCheck = true;
                        MainScene.eliminate(sn1,sn2);
                        console.log(HScanPos,H_flag_r,H_flag_L,V_flag_r,"H_1");
                        return true;
                    }
                }
                console.log(HScanPos,H_flag_r,H_flag_L,V_flag_r,"H_1");
            }
            for(let i=0;i<(CheckScript.GameLv);i++){//扫描target1同行节点与target2是否存在单拐点情况
                let HScanPos:Laya.Vector2=new Laya.Vector2();
                let HSSN:number=-1;
                HScanNode = MainScene.MS_self.GemContain.getChildAt(pos1.x*(CheckScript.GameLv)+i);
                HScanPos = HScanNode.getComponent(CellScript).getCellPos();
                HSSN = HScanNode.getComponent(CellScript).getGemSn();
                if(HScanNode.getComponent(CellScript).getEliminateOrNot()){
                    H_flag_r= Horizon(HScanNode,target2,HScanPos,pos2,false,true);
                    H_flag_L = Horizon(HScanNode,target2,HScanPos,pos2,false,false);
                    V_flag_r=turn_once(HScanNode,target1,HScanPos,pos1,false)
                    if((H_flag_r&&V_flag_r)||(H_flag_L&&V_flag_r)){
                        console.log("存在与target1同行与target2单拐点的点",HScanNode);
                        MainScene.MS_self.DrawLine(sn1,sn2,HSSN,zhedian2);
                        goCheck = true;
                        MainScene.eliminate(sn1,sn2);
                        console.log(HScanPos,H_flag_r,H_flag_L,V_flag_r,"H_2");
                        return true;
                    }
                }
                console.log(HScanPos,H_flag_r,H_flag_L,V_flag_r,"H_2");
            }
        }

        /**
         * 两个拐点，扫描查找
         * @param target1 目标点1
         * @param target2 目标点2
         * @param VScanNode 纵向扫描点
         * @param pos1 
         * @param pos2 
         */
        function turn_twice_VScan(target1:Laya.Node,target2:Laya.Node,VScanNode:Laya.Node,pos1:Laya.Vector2,pos2:Laya.Vector2){
            let H_flag_r;
            let H_flag_L;
            let V_flag_r;
            for(let i=0;i<(CheckScript.GameLv);i++){//扫描target1同行节点与target2是否存在单拐点情况
                let VScanPos:Laya.Vector2=new Laya.Vector2();
                let VSSN:number=-1;
                VScanNode = MainScene.MS_self.GemContain.getChildAt(pos1.y + i*CheckScript.GameLv);
                VScanPos = VScanNode.getComponent(CellScript).getCellPos();
                VSSN = VScanNode.getComponent(CellScript).getGemSn();
                if(VScanNode.getComponent(CellScript).getEliminateOrNot()){
                    H_flag_r= Horizon(VScanNode,target1,VScanPos,pos1,false,true);
                    H_flag_L= Horizon(VScanNode,target1,VScanPos,pos1,false,false);
                    V_flag_r=turn_once(VScanNode,target2,VScanPos,pos2,false)
                    if((H_flag_r&&V_flag_r)||(H_flag_L&&V_flag_r)){
                        console.log("存在与target1同行与target2单拐点的点",VScanNode);
                        MainScene.MS_self.DrawLine(sn1,sn2,VSSN,zhedian2);
                        goCheck = true;
                        MainScene.eliminate(sn1,sn2);
                        console.log(VScanPos,H_flag_r,H_flag_L,V_flag_r,"V_1");
                        return true;
                    }
                }
                console.log(VScanPos,H_flag_r,H_flag_L,V_flag_r,"V_1");
            }
            for(let i=0;i<(CheckScript.GameLv);i++){//扫描target1同行节点与target2是否存在单拐点情况
                let VScanPos:Laya.Vector2=new Laya.Vector2();
                let VSSN:number=-1;
                VScanNode = MainScene.MS_self.GemContain.getChildAt(pos1.y + i*CheckScript.GameLv);
                VScanPos = VScanNode.getComponent(CellScript).getCellPos();
                VSSN = VScanNode.getComponent(CellScript).getGemSn();
                if(VScanNode.getComponent(CellScript).getEliminateOrNot()){
                    H_flag_r= Horizon(VScanNode,target2,VScanPos,pos2,false,true);
                    H_flag_L= Horizon(VScanNode,target2,VScanPos,pos2,false,false);
                    V_flag_r=turn_once(VScanNode,target1,VScanPos,pos1,false)
                    if((H_flag_r&&V_flag_r)||(H_flag_L&&V_flag_r)){
                        console.log("存在与target1同行与target2单拐点的点",VScanNode);
                        MainScene.MS_self.DrawLine(sn1,sn2,VSSN,zhedian2);
                        goCheck = true;
                        MainScene.eliminate(sn1,sn2);
                        console.log(VScanPos,H_flag_r,H_flag_L,V_flag_r,"V_2");
                        return true;
                    }
                }
                console.log(VScanPos,H_flag_r,H_flag_L,V_flag_r,"V_2");
            }
        }
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