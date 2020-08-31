import CellScript from "./CellScript";
import CheckScript_1 from "./CheckScript_1";

export default class MainScene extends Laya.Script {
    GemContain:Laya.Panel;
    /** @prop {name:cellPrefab,tips:"宝石预制体对象",type:Prefab} */
    cellPrefab :Laya.Prefab;
    private GameLV:number=6;
    constructor() { super(); }
    static MS_self:MainScene = null;
    public gemS:Array<Laya.Image>;
    private static remainCount = 0;
    private LineNode:Laya.Sprite=null;

    private CellType=[0,0,0,0];
    /**已经找到的路径数，只允许等于1，0 */
    public static LINECONTRL = 0;
    private LineDetalPos = 80;
    onAwake():void{
        this.GemContain = <Laya.Panel>this.owner.getChildByName("GemContain");
        this.GemContain.width=640;
        this.GemContain.height=640;
        MainScene.MS_self = this;
        MainScene.MS_self.gemS = new Array<Laya.Image>();
        this.LineNode = new Laya.Sprite();
        this.LineNode.x = 0
        this.LineNode.y = 160;
        this.LineNode.width = 640;
        this.LineNode.height = 640;
        this.CellType = new Array(this.getGameLv()+1);
        this.owner.addChild(this.LineNode);

        this.cretatGem();

        let exit=true;
        let exitCount;
        this.cretatGem();
        // do{        
        //     this.cretatGem();
        //     console.log(this.CellType);
        //     let evenCount=0;
        //     for(let i=0;i<MainScene.MS_self.CellType.length;i++){
        //         if(MainScene.MS_self.CellType[i]%2==0){
        //             evenCount++;
        //         }
        //     }
        //     exit = evenCount==MainScene.MS_self.CellType.length;
        //     console.log(exit,"3");
        //     if(exitCount>5){
        //         exit=true;
        //         for(let i=0;i<MainScene.MS_self.CellType.length;i++){
        //             MainScene.MS_self.CellType[i]=this.GameLV;
        //         }
        //     }
        // } while(!exit)
    }

    /**获取游戏等级 */
    getGameLv(){
        return this.GameLV;
    }
    /**单元格width */
    configX = 640/this.GameLV;
    /**单元格height */
    configY = 640/this.GameLV;
    /**游戏区域生成函数 */
    cretatGem(){
        this.GemContain.removeChildren();
        this.gemS=new Array<Laya.Image>();
        for(let i=0;i<this.CellType.length;i++){
            this.CellType[i]=0;
        }
        if(this.GameLV<3)this.GameLV=3;
        if(this.GameLV%2!=0)this.GameLV+=1;
        let cell:Laya.Image = null;
        let sn = 0;
        this.LineDetalPos *= this.configX/160;
        for(let i=0;i<(this.GameLV+2);i++){//创建过程需要优化
            for(let j=0;j<(this.GameLV+2);j++){
                cell = Laya.Pool.getItemByCreateFun("cellPrefab",this.cellPrefab.create,this.cellPrefab);
                cell.getComponent(CellScript).Init(sn,i,j,this.configY);
                sn++;
                cell.x = this.configX * j;
                cell.y = this.configY * i;
                // if(i==0||i==this.GameLV||j==0||j==this.GameLV){
                //     // cell.visible = false;
                //     // cell.getComponent(CellScript).setEliminateOrNot(true);
                // }
                if(cell.visible){
                    this.setCellType(cell.getComponent(CellScript).gemType);
                }
                this.GemContain.addChild(cell);
            }
        }
    }
    /**消除函数 */
    static eliminate(sn1:number,sn2:number){
        let p1_Rootparent = MainScene.MS_self.gemS[sn1].parent.parent.parent
        let p2_Rootparent = MainScene.MS_self.gemS[sn2].parent.parent.parent
        let p1_chioced = <Laya.Image>p1_Rootparent.getChildAt(0);
        let p2_chioced = <Laya.Image>p2_Rootparent.getChildAt(0);
        if(p1_Rootparent.getComponent(CellScript).getEliminateOrNot()==false&&p2_Rootparent.getComponent(CellScript).getEliminateOrNot()==false){
            MainScene.MS_self.gemS[sn1].visible = false;
            MainScene.MS_self.gemS[sn2].visible = false;
            p1_Rootparent.getComponent(CellScript).setEliminateOrNot(true);
            p2_Rootparent.getComponent(CellScript).setEliminateOrNot(true);
            MainScene.remainCount-=2;
            MainScene.LINECONTRL = 1;
        }
        p1_chioced.visible = false;
        p2_chioced.visible = false;
        CheckScript_1.reSet();
        for(let i=0;i<MainScene.MS_self.GemContain.numChildren-1;i++){
            for(let j=i+1;j<MainScene.MS_self.GemContain.numChildren;j++){
                let imgI = <Laya.Image>MainScene.MS_self.GemContain.getChildAt(i);
                let imgJ = <Laya.Image>MainScene.MS_self.GemContain.getChildAt(j);
                let gemI = <Laya.Image>MainScene.MS_self.gemS[i];
                let gemJ = <Laya.Image>MainScene.MS_self.gemS[j];
                if(imgI.visible&&imgJ.visible&&gemI.visible&&gemJ.visible){
                    if(imgI.getComponent(CellScript).gemType==imgJ.getComponent(CellScript).gemType){
                        return true;
                    }
                }
            }
        }
        console.log("没有可以消除的");
        return false;
    }
    /**取消选中函数
     * @param sn1 选中的目标点1
     * @param sn2 选中的目标点2
     */
    static cancleChioced(sn1,sn2){
        console.log("can not eliminate");
        let timer = new Laya.Timer();
        timer.once(500,this,()=>{
            let target1_img = <Laya.Image>MainScene.MS_self.gemS[sn1].parent.parent.parent.getChildAt(0)//.destroy();
            target1_img.visible = false;
            let target2_img = <Laya.Image>MainScene.MS_self.gemS[sn2].parent.parent.parent.getChildAt(0)//.destroy();
            target2_img.visible = false;
            timer.clear(this,()=>{
                console.log("清除计时器");
            });
        })
        CheckScript_1.reSet();
    }

    
    /**
     * 划线
     * @param start 起点序号
     * @param end 终点
     * @param arg1 折点1
     * @param arg2 折点2
     */
    public DrawLine(start,end,arg1?,arg2?){
        let startSp = <Laya.Sprite>this.GemContain.getChildAt(start);
        let startPos = new Laya.Point(startSp.x+this.LineDetalPos,startSp.y+this.LineDetalPos);
        let endSp = <Laya.Sprite>this.GemContain.getChildAt(end);
        let endPos:Laya.Point;
        if(arg1&&arg2){
            let arg1Sp = <Laya.Sprite>this.GemContain.getChildAt(arg1);
            let arg1Pos =   new Laya.Point(arg1Sp.x+this.LineDetalPos,arg1Sp.y+this.LineDetalPos);
            let arg2Sp = <Laya.Sprite>this.GemContain.getChildAt(arg2);
            let arg2Pos =   new Laya.Point(arg2Sp.x+this.LineDetalPos,arg2Sp.y+this.LineDetalPos);
            console.log(arg1Pos)
            console.log(arg2Pos)
            endPos = new Laya.Point(endSp.x+this.LineDetalPos,endSp.y+this.LineDetalPos);

            this.LineNode.graphics.drawLine(startPos.x,startPos.y,arg1Pos.x,arg1Pos.y,"ff0000",2);//使用drawLines不知道为什么会画的线不是预期，参数3是起点坐标的相对值。
            this.LineNode.graphics.drawLine(arg1Pos.x,arg1Pos.y,arg2Pos.x,arg2Pos.y,"ff0000",2);
            this.LineNode.graphics.drawLine(arg2Pos.x,arg2Pos.y,endPos.x,endPos.y,"ff0000",2);
        }else if(arg1&&!arg2){
            let arg1Sp = <Laya.Sprite>this.GemContain.getChildAt(arg1);
            let arg1Pos =   new Laya.Point(arg1Sp.x+this.LineDetalPos,arg1Sp.y+this.LineDetalPos);
            console.log(arg1Pos)
            endPos = new Laya.Point(endSp.x+this.LineDetalPos,endSp.y+this.LineDetalPos);
            this.LineNode.graphics.drawLine(startPos.x,startPos.y,arg1Pos.x,arg1Pos.y,"ff0000",2);
            this.LineNode.graphics.drawLine(arg1Pos.x,arg1Pos.y,endPos.x,endPos.y,"ff0000",2);
        }
        else{
            endPos = new Laya.Point(endSp.x+this.LineDetalPos,endSp.y+this.LineDetalPos);
            this.LineNode.graphics.drawLine(startPos.x,startPos.y,endPos.x,endPos.y,"ff0000",2);
        }
        console.log(startPos)
        console.log(endPos)
        let timer = new Laya.Timer();
        timer.once(500,this,()=>{
            // MainScene.LINECONTRL = 0;
            MainScene.MS_self.LineNode.graphics.clear();
            timer.clear(this,()=>{
                console.log("清除计时器");
            });
        })
    }


    setCellType(type){
        this.CellType[type-1]++;
    }
}